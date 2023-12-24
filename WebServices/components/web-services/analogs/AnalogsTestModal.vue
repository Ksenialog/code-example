<template>
  <WModal
    width="1140px"
    :loading="isLoading"
    class="analogs-test-modal"
    @close="$emit('close')"
  >
    <template #header>
      <div class="analogs-test-modal__header px-8 py-6">
        <h2 class="wt-h-2 wtm-h-3 mb-6">{{ messages.testTitle }}</h2>

        <WForm ref="form" @submit="submitWebAnalogs">
          <div class="analogs-test-modal__filters">
            <div class="analogs-test-modal__filters-wrapper">
              <WebServicesControl
                v-for="item in analogsFilterControls"
                :key="item.name"
                :control="item"
                :value="formData[item.name]"
                @change="setFormData($event, item.name)"
              />
            </div>

            <WButton type="submit" accent="secondary">{{ messages.search }}</WButton>
          </div>
        </WForm>
      </div>
    </template>

    <WNotice
      v-for="(notice, idx) in noticeConfig"
      :key="idx"
      :type="notice.type"
      class="wt-control-m"
      :class="notice.class ?? ''"
    >
      {{ notice.message }}

      <WLink
        v-if="notice.link"
        view="tooltip"
        class="wt-control-m"
        @click="setChosenFormData({code: notice.code}, false)"
      >
        {{ notice.link }}
      </WLink>
    </WNotice>

    <RecycleScroller
      v-if="tableData.length"
      :items="preparedTableData"
      :item-size="49"
      key-field="index"
      page-mode
      :buffer="130"
    >
      <template #default="{ itemsPool: visibleRows, sizeBefore, sizeAfter }">
        <WTable
          :columns="tableColumns"
          :rows="visibleRows"
          column-name-key="key"
          virtual
          sticky-header
          :virtual-size-before="sizeBefore"
          :virtual-size-after="sizeAfter"
          fixed
          class="analogs-test-modal__table"
        >
          <colgroup>
            <col
              v-for="column in tableColumns"
              :key="column.name"
              :style="getColStyle(column)"
            >
          </colgroup>

          <template #cell(code)="{ value, row }">
            <WLink
              v-if="!row.deleted"
              class="analogs-test-modal__link wt-control-m"
              data-line-clamp="1"
              :title="value"
              @click="setChosenFormData(row.searchParams.byCode)"
            >
              {{ value }}
            </WLink>
            <p
              v-else
              class="analogs-test-modal__text analogs-test-modal__text_disabled"
              data-line-clamp="1"
              :title="value"
            >
              {{ value }}
            </p>
          </template>

          <template #cell(producer)="{ value, row }">
            <div data-line-clamp="1" :title="getProducerTitle(value)">
              <WLink
                v-if="!row.deleted"
                class="wt-control-m"
                @click="setChosenFormData(row.searchParams.byProducer)"
              >
                {{ getProducerText(value) }}
              </WLink>
              <p
                v-else
                class="analogs-test-modal__text analogs-test-modal__text_disabled"
              >
                {{ getProducerText(value) }}
              </p>

              <span
                v-if="value.synonymPart"
                class="analogs-test-modal__text"
                :class="{ 'analogs-test-modal__text_disabled': row.deleted }"
              >
                {{ value.synonymPart }}
              </span>
            </div>
          </template>

          <template #cell(rating)="{ value, row }">
            <StarRating
              :star-size="24"
              :rating="value"
              :show-rating="false"
              :rtl="rtl"
              :active-color="`var(${row.deleted ? '--color-text-disable' : '--color-warning'})`"
              inactive-color="var(--color-text-secondary-contrast)"
              read-only
            />
          </template>

          <template #cell(name)="{ value, row }">
            <p
              class="analogs-test-modal__text"
              :class="{ 'analogs-test-modal__text_disabled': row.deleted }"
              data-line-clamp="1"
              :title="value"
            >
              {{ value }}
            </p>
          </template>

          <template #cell(synonym)="{ value, row }">
            <p
              class="analogs-test-modal__text"
              :class="{ 'analogs-test-modal__text_disabled': row.deleted }"
              data-line-clamp="1"
              :title="value"
            >
              {{ value }}
            </p>
          </template>
        </WTable>
      </template>
    </RecycleScroller>
  </WModal>
</template>

<script>
import StarRating from 'vue-star-rating';
import {
  WForm,
  WTable,
  WModal,
  WButton,
  WLink,
  WNotice,
} from '@tradesoft/war-ui';
import { RecycleScroller } from '@tradesoft/war-vendor/vue-virtual-scroller';
import isRTL from '@tradesoft/war-common/const/isRTL';
import NoticeMessages from 'Common/Components/NoticeMessages';
import WebServicesControl from '../../WebServicesControl.vue';
import Api from '../../../api';
import normalizeControlValue from '../../../utils/normalizeControlValue';

export default {
  name: 'AnalogsTestModal',
  components: {
    WForm,
    WButton,
    WModal,
    WTable,
    WebServicesControl,
    WLink,
    WNotice,
    RecycleScroller,
    StarRating,
  },
  inject: ['messages'],
  data() {
    return {
      isLoading: false,
      analogsFilterControls: [],
      formData: {},
      tableColumns: [],
      tableData: [],
      noticeList: [],
      rtl: isRTL,
      serverError: null,
    };
  },
  computed: {
    noticeConfig() {
      const noticeList = [];
      if (this.serverError) {
        noticeList.push({
          type: 'info',
          message: this.serverError,
        });
      }
      if (!this.serverError && this.noticeList.length) {
        this.noticeList.forEach((notice) => {
          noticeList.push({
            type: 'warning',
            message: notice.message.replace('{code}', notice.code),
            link: notice.link?.replace('{code}', notice.code),
            code: notice.code,
            class: 'mb-6',
          });
        });
      }
      return noticeList;
    },
    /* Т.к. в результатах поиска нет уникального ключа, добавляем index для виртуализации */
    preparedTableData() {
      return this.tableData.map((item, index) => ({
        ...item,
        index,
      }));
    },
  },
  async created() {
    await this.getWebAnalogsFilterConfig();
    await this.submitWebAnalogs();
  },
  methods: {
    async getWebAnalogsFilterConfig() {
      this.isLoading = true;
      const result = await Api.getInstance().getWebAnalogsFilterConfig();
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data }) => {
          this.formData = data.reduce((acc, item) => {
            acc[item.name] = normalizeControlValue(item?.defaultValue, item.templateId);

            return acc;
          }, {});

          this.analogsFilterControls = data;
          this.serverError = data.errorList;
        },
      );
    },

    async submitWebAnalogs() {
      const isProducer = this.formData?.producer;

      this.isLoading = true;
      const result = isProducer
        ? await Api.getInstance().getTestingWebAnalogsByProducer(this.formData)
        : await Api.getInstance().getTestingWebAnalogsByCode(this.formData);
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data }) => {
          this.tableColumns = data.tableConfig;
          this.tableData = data.tableData ?? [];
          this.serverError = data.errorList;
          this.noticeList = data.noticeList ?? [];
        },
      );
    },

    setFormData(value, name) {
      this.$set(this.formData, name, value);
    },

    resetFormData() {
      Object.entries(this.formData).forEach(([key]) => {
        if (key === 'showSynonyms') return;

        this.setFormData('', key);
      });
    },

    setChosenFormData(searchParams, resetParam = true) {
      if (resetParam) this.resetFormData();
      Object.entries(searchParams).forEach(([key, value]) => this.setFormData(value, key));
      this.submitWebAnalogs();
    },

    getProducerText(value) {
      return value.producerPart ?? value;
    },

    getProducerTitle(value) {
      let title = this.getProducerText(value);

      if (value.synonymPart) {
        title = `${title} ${value.synonymPart}`;
      }

      return title;
    },

    getColStyle(column) {
      return {
        width: column.width,
        minWidth: column.minWidth,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.analogs-test-modal {
  &__header {
    background-color: var(--color-bg-secondary);
  }

  &__filters {
    display: flex;
    justify-content: space-between;
  }

  &__filters-wrapper {
    display: grid;
    grid-template-columns: repeat(3, minmax(min-content, 240px));
    align-items: center;
    gap: 24px;
  }

  &__table {
    /deep/ .w-table-row_sticky {
      top: -8px;
    }
  }

  &__link {
    max-width: 100%;
    white-space: nowrap;
  }

  &__text {
    margin: 0;

    &_disabled {
      color: var(--color-text-disable);
    }
  }
}
</style>

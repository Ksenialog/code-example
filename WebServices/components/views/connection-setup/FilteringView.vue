<template>
  <WSpinner v-if="isLoading" size="36" block />

  <div v-else class="filtering">
    <WNotice
      v-for="item in notices"
      :key="item.content"
      :type="item.type"
      :show-icon="false"
      class="mb-8 filtering__notice"
    >
      <div v-if="item.content" v-html="item.content" />

      <template v-if="item.isCommonSettings">
        <h3 class="wt-h-4 mb-1">{{ messages.commonSettings }}</h3>
        <ul class="filtering__list">
          <li v-for="item in commonSettingsList" :key="item.title">
            {{ item.title }}: {{ item.value }}
          </li>
        </ul>
      </template>
    </WNotice>

    <WebServicesForm
      v-if="isFilteringFormShown"
      :form-data="formData"
      :items="formControls"
      @change="setFormData"
      @submit="saveFormData"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import { WSpinner, WNotice } from '@tradesoft/war-ui';
import { type } from '@tradesoft/war-ui/const/notice';
import NoticeMessages from 'Common/Components/NoticeMessages';
import WebServicesForm from '../../WebServicesForm.vue';
import Api from '../../../api';
import formView from '../../../mixins/formView';
import normalizeFormData from '../../../utils/normalizeFormData';

const settingsList = [
  'mostCheapestWanted',
  'mostCheapestAnalogs',
  'mostFastestWanted',
  'mostFastestAnalogs',
  'deliveryTimeAverage',
  'deliveryTimeMaxGuaranteed',
  'minRating',
];

export default {
  name: 'FilteringView',
  components: {
    WSpinner,
    WNotice,
    WebServicesForm,
  },
  mixins: [formView],
  inject: ['messages'],
  data() {
    return {
      isLoading: false,
      commonSettings: {},
      filteringMessages: {},
      isUseFilteringCommon: false,
      isAllowFilteringPersonal: false,
    };
  },
  computed: {
    isFilteringFormShown() {
      return this.isUseFilteringCommon && this.isAllowFilteringPersonal;
    },
    notices() {
      const { filteringCommonOff, filteringCommonOn } = this.filteringMessages;
      const { INFO, WARNING } = type;
      const notices = [];

      if (!this.isUseFilteringCommon) {
        notices.push({
          type: WARNING,
          content: filteringCommonOff,
        });
      }

      if (this.isUseFilteringCommon && !this.isAllowFilteringPersonal) {
        notices.push({
          type: INFO,
          content: filteringCommonOn,
        });
      }

      if (this.isUseFilteringCommon && this.isAllowFilteringPersonal) {
        notices.push({
          type: INFO,
          isCommonSettings: true,
        });
      }

      return notices;
    },

    commonSettingsList() {
      return settingsList.map(
        (item) => ({
          title: this.messages[item],
          value: this.commonSettings[item] ?? '-',
        }),
      );
    },
  },
  created() {
    this.getFilteringData();
  },
  methods: {
    async getFilteringData() {
      const { name } = this.$route;
      const { providerId, connectionId } = this.$route.params;

      this.isLoading = true;
      const result = await Api.getInstance().getProviderTab({
        tabName: name,
        providerName: providerId,
        datafileId: connectionId,
      });
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data, meta }) => {
          const normalizedData = normalizeFormData(data.providerSettings, meta.config);

          this.formData = cloneDeep(normalizedData);
          this.initialFormData = cloneDeep(normalizedData);
          this.formControls = meta.config;
          this.commonSettings = data.commonSettings;
          this.filteringMessages = meta.messages;
          this.isUseFilteringCommon = data.useFilteringCommon;
          this.isAllowFilteringPersonal = data.allowFilteringPersonal;
        },
      );
    },

    async saveFormData() {
      const { name } = this.$route;
      const { providerId, connectionId } = this.$route.params;

      this.isLoading = true;
      const result = await Api.getInstance().postProviderTab({
        tabName: name,
        providerName: providerId,
        datafileId: connectionId,
      },
      { [name]: this.formData });
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data }) => {
          NoticeMessages.showSuccessNotice(data.message);
          this.initialFormData = cloneDeep(this.formData);
        },
      );
    },
  },
};
</script>

<style lang="less" scoped>
.filtering {
  &__notice {
    width: 576px;
  }

  &__list {
    padding: 0;
    list-style: none;
  }
}
</style>

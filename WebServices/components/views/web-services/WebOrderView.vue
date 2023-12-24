<template>
  <WSpinner v-if="isLoading" size="36" block />

  <div v-else class="web-order-view">
    <WNotice
      v-if="!isWebOrderAvailable"
      class="web-order-view__notice mx-8 my-10"
      :show-icon="false"
      type="warning"
    >
      <div v-html="messages.webOrderNotAvailable" />
      <div v-html="messages.contactTradesoft" />
    </WNotice>

    <div v-else class="web-order-view__content pt-5">
      <WebOrderTabs
        :tabs="tabs"
        :active="activeTabName"
        @change="onOrderTabClick"
      />

      <WSpinner v-if="isInnerLoading" size="36" block />
      <WebServicesForm
        v-else
        :key="activeTabName"
        class="pb-10 mt-5"
        :title="tabTitle"
        :items="preparedFormControls"
        :form-data="formData"
        @change="setFormData"
        @submit="saveFormData"
      />
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import { WSpinner, WNotice } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import WebOrderTabs from '../../web-services/web-order/WebOrderTabs.vue';
import WebServicesForm from '../../WebServicesForm.vue';
import formView from '../../../mixins/formView';
import Api from '../../../api';
import isNeedSave from '../../../utils/isNeedSave';
import normalizeFormData from '../../../utils/normalizeFormData';

const defaultActiveTabName = 'settings';

export default {
  name: 'WebOrderView',
  components: {
    WSpinner,
    WNotice,
    WebServicesForm,
    WebOrderTabs,
  },
  mixins: [formView],
  inject: [
    'messages',
  ],
  data() {
    return {
      isLoading: false,
      isInnerLoading: false,
      isWebOrderAvailable: false,
      tabs: null,
      activeTabName: null,
      settingsFormControls: [],
      syncStateFormControls: [],
    };
  },
  computed: {
    tabTitle() {
      return this.tabs.find(({ name }) => name === this.activeTabName)?.title || '';
    },
    preparedFormControls() {
      return this.activeTabName === defaultActiveTabName
        ? this.settingsFormControls
        : this.syncStateFormControls;
    },
  },
  created() {
    this.getWebOrder();
  },
  methods: {
    setActiveTab(activeTabName) {
      this.activeTabName = activeTabName;
    },
    async getWebOrder() {
      this.isLoading = true;
      const result = await Api.getInstance().getWebOrder();
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data, meta }) => {
          const normalizedData = normalizeFormData(
            data,
            [...meta.tabConfig.settings, ...meta.tabConfig.syncState],
          );

          this.isWebOrderAvailable = meta.isWebOrderAvailable;
          this.tabs = meta.tabList;
          this.formData = cloneDeep(normalizedData);
          this.initialFormData = cloneDeep(normalizedData);
          this.settingsFormControls = meta.tabConfig.settings;
          this.syncStateFormControls = meta.tabConfig.syncState;
          this.setActiveTab(defaultActiveTabName);
        },
      );
    },
    async saveFormData() {
      this.isInnerLoading = true;
      const result = await Api.getInstance().postWebOrder(this.formData);
      this.isInnerLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data }) => {
          NoticeMessages.showSuccessNotice(data.message);
          this.initialFormData = cloneDeep(this.formData);
        },
      );
    },
    async onOrderTabClick(activeTab) {
      if (activeTab === this.activeTabName) return;

      if (!this.isEqual) {
        const isConfirmed = await isNeedSave(this.messages);

        if (isConfirmed) {
          await this.saveFormData();
        } else {
          this.formData = cloneDeep(this.initialFormData);
        }
      }

      this.setActiveTab(activeTab);
    },
  },
};
</script>

<style lang="less" scoped>
.web-order-view {
  height: 100%;

  &__notice {
    width: 608px;
  }

  &__content {
    display: grid;
    grid-template-columns: 288px 1fr;
    height: 100%;
    gap: 32px;
  }
}
</style>

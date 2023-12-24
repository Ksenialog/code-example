<template>
  <WSpinner v-if="isLoading" size="36" block />

  <div v-else class="account-view">
    <WebServicesForm
      ref="form"
      :form-data="formData"
      :items="formControls"
      @change="setFormData"
      @submit="saveFormData"
    >
      <template #after-control="{ item }">
        <WHint
          v-if="item.afterControl"
          placement="top"
          mode="hover"
        >
          <WButton accent="secondary" icon="only" @click="setIsShowedSidebar">
            <WIcon width="24" height="24" name="button-add-m" />
          </WButton>

          <template #hint>{{ messages.addNewProvider }}</template>
        </WHint>
      </template>
    </WebServicesForm>

    <WNotice
      v-if="accountMessage"
      :show-icon="false"
      class="account-view__notice mt-6"
    >
      {{ accountMessage }}
    </WNotice>

    <NewProviderSidebar
      v-if="isShowedSidebar"
      @create="setCreatedProvider"
      @close="setIsShowedSidebar(false)"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import {
  WSpinner,
  WButton,
  WHint,
  WIcon,
  WNotice,
} from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import WebServicesForm from '../../WebServicesForm.vue';
import Api from '../../../api';
import formView from '../../../mixins/formView';
import { CONNECTION_SETUP_SETUP } from '../../../const/routeName';
import normalizeFormData from '../../../utils/normalizeFormData';
import { addConnectionId } from '../../../const/connection';

const PROVIDER_NAME = 'provider';

export default {
  name: 'AccountView',
  components: {
    WButton,
    WSpinner,
    WHint,
    WIcon,
    WNotice,
    WebServicesForm,
    NewProviderSidebar: () => import(
      /* webpackChunkName: "NewProviderSidebar" */
      '../../connection-setup/account/NewProviderSidebar.vue'
    ),
  },
  mixins: [formView],
  inject: ['messages'],
  data() {
    return {
      isLoading: false,
      isShowedSidebar: false,
      accountMessage: null,
    };
  },
  computed: {
    isNewConnection() {
      return this.$route.params.connectionId === addConnectionId;
    },
  },
  created() {
    this.getData();
  },
  methods: {
    setIsShowedSidebar(val = true) {
      this.isShowedSidebar = val;
    },

    async setCreatedProvider({ key }) {
      this.setFormData(key, PROVIDER_NAME);
      const previousFormData = cloneDeep(this.formData);
      await this.getData();
      this.formData = previousFormData;
    },

    async getAccountData() {
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
          const normalizedData = normalizeFormData(data, meta.config);

          this.formData = cloneDeep(normalizedData);
          this.initialFormData = cloneDeep(normalizedData);
          this.formControls = meta.config;
          this.accountMessage = meta.loginInfoText;
        },
      );
    },

    async getNewAccountProviderConnection() {
      const { providerId } = this.$route.params;

      this.isLoading = true;
      const result = await Api.getInstance().getNewAccountProviderConnection(providerId);
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data, meta }) => {
          const normalizedData = normalizeFormData(data, meta.config);

          this.formData = cloneDeep(normalizedData);
          this.initialFormData = cloneDeep(normalizedData);
          this.formControls = meta.config;
          this.accountMessage = meta.notice;
        },
      );
    },

    async getData() {
      // eslint-disable-next-line no-unused-expressions
      this.isNewConnection
        ? await this.getNewAccountProviderConnection()
        : await this.getAccountData();
    },

    async postAccountFormData() {
      if (!this.$refs.form.$refs.form.validate()) return;

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

    async postNewAccountProviderConnection() {
      if (!this.$refs.form.$refs.form.validate()) return;

      const { name } = this.$route;
      const { providerId } = this.$route.params;

      this.isLoading = true;
      const result = await Api.getInstance().postNewAccountProviderConnection(
        providerId,
        { [name]: this.formData },
      );
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data }) => {
          NoticeMessages.showSuccessNotice(data.message);
          this.initialFormData = cloneDeep(this.formData);
          this.$router.replace({
            name: CONNECTION_SETUP_SETUP,
            params: {
              ...this.$route.params,
              connectionId: data.datafileId,
            },
          });
        },
      );
    },

    saveFormData() {
      // eslint-disable-next-line no-unused-expressions
      this.isNewConnection
        ? this.postNewAccountProviderConnection()
        : this.postAccountFormData();
    },
  },
};
</script>

<style lang="less" scoped>
.account-view {
  &__notice {
    width: 608px;
  }
}
</style>

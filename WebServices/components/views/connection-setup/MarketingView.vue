<template>
  <WSpinner v-if="isLoading" size="36" block />

  <WebServicesForm
    v-else
    :form-data="formData"
    :items="formControls"
    @change="setFormData"
    @submit="saveFormData"
  />
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import { WSpinner } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import WebServicesForm from '../../WebServicesForm.vue';
import Api from '../../../api';
import formView from '../../../mixins/formView';
import normalizeFormData from '../../../utils/normalizeFormData';

export default {
  name: 'MarketingView',
  components: {
    WSpinner,
    WebServicesForm,
  },
  mixins: [formView],
  data() {
    return {
      isLoading: false,
    };
  },
  created() {
    this.getMarketingData();
  },
  methods: {
    async getMarketingData() {
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

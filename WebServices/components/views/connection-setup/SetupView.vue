<template>
  <WSpinner v-if="isLoading" size="36" block />
  <WebServicesForm
    v-else
    :items="formControls"
    :form-data="formData"
    @change="setFormData"
    @submit="saveFormData"
  />
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import { WSpinner } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import Api from '../../../api';
import formView from '../../../mixins/formView';
import WebServicesForm from '../../WebServicesForm.vue';
import normalizeFormData from '../../../utils/normalizeFormData';

export default {
  name: 'SetupView',
  components: {
    WSpinner,
    WebServicesForm,
  },
  mixins: [formView],
  inject: ['messages'],
  data() {
    return {
      isLoading: false,
    };
  },
  created() {
    this.getSetupTabData();
  },
  methods: {
    async getSetupTabData() {
      this.isLoading = true;
      const { name, params: { providerId, connectionId } } = this.$route;
      const response = await Api.getInstance().getProviderTab({
        tabName: name,
        providerName: providerId,
        datafileId: connectionId,
      });
      this.isLoading = false;
      response.either(
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
      this.isLoading = true;
      const { name, params: { providerId, connectionId } } = this.$route;
      const result = await Api.getInstance().postProviderTab({
        tabName: name,
        providerName: providerId,
        datafileId: connectionId,
      }, { [name]: this.formData });
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

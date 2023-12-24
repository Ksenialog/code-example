<template>
  <WSpinner v-if="isLoading" size="36" block />
  <WebServicesForm
    v-else
    :title="messages.settingsTitle"
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
import WebServicesForm from '../../WebServicesForm.vue';
import formView from '../../../mixins/formView';
import Api from '../../../api';
import normalizeFormData from '../../../utils/normalizeFormData';

export default {
  name: 'SettingsView',
  components: {
    WSpinner,
    WebServicesForm,
  },
  mixins: [formView],
  inject: [
    'messages',
  ],
  data() {
    return {
      isLoading: false,
    };
  },
  created() {
    this.getSettings();
  },
  methods: {
    async getSettings() {
      this.isLoading = true;
      const result = await Api.getInstance().getSettings();
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data, meta }) => {
          const normalizedData = normalizeFormData(data, meta);

          this.formData = cloneDeep(normalizedData);
          this.initialFormData = cloneDeep(normalizedData);
          this.formControls = meta;
        },
      );
    },
    async saveFormData() {
      this.isLoading = true;
      const result = await Api.getInstance().postSettings(this.formData);
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

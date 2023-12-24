<template>
  <WSpinner v-if="isLoading" size="36" block />

  <div v-else>
    <WNotice
      v-if="!isPartInfoAvailable"
      :show-icon="false"
      type="warning"
    >
      <div v-html="messages.notActiveService" />
      <div v-html="messages.contactTradesoft" />
    </WNotice>

    <WebServicesForm
      v-else
      :items="preparedFormControls"
      :form-data="formData"
      @change="setFormData"
      @submit="saveFormData"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import { WNotice, WSpinner } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import WebServicesForm from '../../WebServicesForm.vue';
import formView from '../../../mixins/formView';
import Api from '../../../api';
import normalizeFormData from '../../../utils/normalizeFormData';

export default {
  name: 'WebInfoView',
  components: {
    WSpinner,
    WNotice,
    WebServicesForm,
  },
  mixins: [formView],
  inject: [
    'messages',
  ],
  data() {
    return {
      isLoading: false,
      isPartInfoAvailable: false,
      webInfoFormData: [],
      webInfoLanguagesControls: [],
      webInfoLanguagesFormData: [],
    };
  },
  computed: {
    preparedFormControls() {
      return [...cloneDeep(this.formControls), ...cloneDeep(this.webInfoLanguagesControls)];
    },
  },
  async created() {
    this.isLoading = true;
    await Promise.all([this.getWebInfo(), this.getWebInfoLanguages()]);
    this.isLoading = false;

    const normalizedData = normalizeFormData(
      { ...this.webInfoFormData, ...this.webInfoLanguagesFormData },
      this.preparedFormControls,
    );

    this.formData = cloneDeep(normalizedData);
    this.initialFormData = cloneDeep(normalizedData);
  },
  methods: {
    async getWebInfo() {
      const result = await Api.getInstance().getWebInfo();

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data, meta }) => {
          this.isPartInfoAvailable = meta.isPartInfoAvailable;
          this.webInfoFormData = data;
          this.formControls = meta.config;
        },
      );
    },

    async getWebInfoLanguages() {
      const result = await Api.getInstance().getWebInfoLanguages();

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data, meta }) => {
          this.webInfoLanguagesFormData = data;
          this.webInfoLanguagesControls = Object.values(meta);
        },
      );
    },

    async saveFormData() {
      const languages = Object.keys(this.webInfoLanguagesFormData);
      const formData = Object.entries(this.formData).reduce((acc, [key, value]) => {
        if (languages.includes(key)) {
          acc.piLang[key] = value;
          return acc;
        }

        acc[key] = value;
        return acc;
      }, {
        piLang: {},
      });

      this.isLoading = true;
      const result = await Api.getInstance().postWebInfo(formData);
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

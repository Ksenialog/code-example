<template>
  <WSpinner v-if="isLoading" size="36" block />

  <div v-else>
    <WNotice
      v-if="!isWebAnalogAvailable"
      :show-icon="false"
      type="warning"
    >
      <div v-html="messages.notActiveService" />
      <div v-html="messages.contactTradesoft" />
    </WNotice>

    <WebServicesForm
      v-else
      :items="formControls"
      :form-data="formData"
      @change="setFormData"
      @submit="saveFormData"
    />

    <AnalogsTestModal
      v-if="isModalOpen"
      @close="setIsModalOpen(false)"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import { createNamespacedHelpers } from 'vuex';
import { WNotice, WSpinner } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import WebServicesForm from '../../WebServicesForm.vue';
import formView from '../../../mixins/formView';
import Api from '../../../api';
import normalizeFormData from '../../../utils/normalizeFormData';

const testingNS = createNamespacedHelpers('testing');

export default {
  name: 'AnalogsView',
  components: {
    WSpinner,
    WNotice,
    WebServicesForm,
    AnalogsTestModal: () => import(
      /* webpackChunkName: "AnalogsTestModal" */
      '../../web-services/analogs/AnalogsTestModal.vue'
    ),
  },
  mixins: [formView],
  inject: [
    'messages',
  ],
  data() {
    return {
      isLoading: false,
      isWebAnalogAvailable: false,
    };
  },
  computed: {
    ...testingNS.mapState(['isModalOpen']),
  },
  watch: {
    formData: {
      handler() {
        this.setIsButtonDisabled(!this.formData.useWebAnalogSearch);
      },
      deep: true,
    },
  },
  created() {
    this.getWebAnalogs();
  },
  methods: {
    ...testingNS.mapActions([
      'setIsButtonDisabled',
      'setIsModalOpen',
    ]),
    async getWebAnalogs() {
      this.isLoading = true;
      const result = await Api.getInstance().getWebAnalogs();
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data, meta }) => {
          const normalizedData = normalizeFormData(data, meta.config);

          this.formData = cloneDeep(normalizedData);
          this.initialFormData = cloneDeep(normalizedData);
          this.formControls = meta.config;
          this.isWebAnalogAvailable = meta.isWebAnalogAvailable;
        },
      );
    },

    async saveFormData() {
      this.isLoading = true;
      const result = await Api.getInstance().postWebAnalogs(this.formData);
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

<template>
  <WSpinner v-if="isLoading" size="36" block />

  <div v-else class="delivery-schedule-view">
    <WebServicesForm
      :form-data="formData"
      :items="formControls"
      @change="setFormData"
      @submit="saveFormData"
    />

    <div v-if="isExtraSettingsShown" class="mt-8">
      <WNotice
        :show-icon="false"
        class="delivery-schedule-view__notice mb-4"
      >
        {{ deliveryScheduleNotice }}
      </WNotice>

      <WLink
        view="button"
        :href="deliveryScheduleUrl"
        target="_blank"
        class="wt-control-m"
        @click.prevent="openPopup"
      >
        {{ messages.configure }}
      </WLink>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import { WSpinner, WLink, WNotice } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import WebServicesForm from '../../WebServicesForm.vue';
import Api from '../../../api';
import formView from '../../../mixins/formView';
import normalizeFormData from '../../../utils/normalizeFormData';

export default {
  name: 'DeliveryScheduleView',
  components: {
    WSpinner,
    WLink,
    WNotice,
    WebServicesForm,
  },
  mixins: [formView],
  data() {
    return {
      isLoading: false,
      deliveryScheduleUrl: '',
      deliveryScheduleNotice: '',
    };
  },
  computed: {
    isExtraSettingsShown() {
      return this.formData?.useDeliverySchedule;
    },
  },
  created() {
    this.getDeliverySchedule();
  },
  methods: {
    async getDeliverySchedule() {
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
          this.deliveryScheduleUrl = meta.deliveryScheduleLink;
          this.deliveryScheduleNotice = meta.notice;
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

    openPopup() {
      const url = new URL(this.deliveryScheduleUrl, window.location.origin);
      url.searchParams.append('hide_header', 1);

      window.open(url, '', 'width=800,height=600,scrollbars=yes');
    },
  },
};
</script>

<style lang="less" scoped>
.delivery-schedule-view {
  &__notice {
    width: 576px;
  }
}
</style>

<template>
  <WSpinner v-if="isLoading" size="36" block />

  <div v-else class="state-mapping">
    <WNotice
      v-if="stateMappingMessage"
      :show-icon="false"
      class="state-mapping__notice mb-8"
    >
      <div v-html="stateMappingMessage" />
    </WNotice>

    <div v-if="formControls.length">
      <WFormGroup large-label class="mb-2">
        <template #label>
          <span class="wt-caption">{{ messages.providerStatus }}</span>
        </template>

        <span class="wt-caption">{{ messages.warStates }}</span>
      </WFormGroup>

      <WebServicesForm
        ref="form"
        :form-data="formData"
        :items="formControls"
        @change="setFormData"
        @submit="saveFormData"
      />
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import { WSpinner, WNotice, WFormGroup } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import WebServicesForm from '../../WebServicesForm.vue';
import Api from '../../../api';
import formView from '../../../mixins/formView';
import normalizeFormData from '../../../utils/normalizeFormData';

export default {
  name: 'StateMappingView',
  components: {
    WSpinner,
    WNotice,
    WFormGroup,
    WebServicesForm,
  },
  mixins: [formView],
  inject: ['messages'],
  data() {
    return {
      isLoading: false,
      stateMappingMessage: '',
    };
  },
  created() {
    this.getStateMappingData();
  },
  methods: {
    async getStateMappingData() {
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
          // Пустая data.webToWarStateId приходит как []
          const normalizedData = normalizeFormData(
            Array.isArray(data.webToWarStateId) ? {} : data.webToWarStateId,
            meta.config,
          );

          this.formData = cloneDeep(normalizedData);
          this.initialFormData = cloneDeep(normalizedData);
          this.formControls = meta.config;
          this.stateMappingMessage = meta.notice;
        },
      );
    },

    async saveFormData() {
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
  },
};
</script>

<style lang="less" scoped>
.state-mapping {
  &__notice {
    width: 576px;
  }
}
</style>

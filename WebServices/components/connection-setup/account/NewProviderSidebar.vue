<template>
  <WSidebar
    large-width
    :loading="isLoading"
    class="new-provider-sidebar"
    @hide="closeNewProviderSidebar"
  >
    <template #title>
      {{ messages.newProvider }}
    </template>

    <WebServicesForm
      ref="form"
      :items="newProviderControls"
      :form-data="formData"
      form-id="provider-form"
      @change="setFormData"
      @submit="saveFormData"
    />

    <template v-if="!isLoading" #footer>
      <div class="new-provider-sidebar__footer">
        <WButton type="submit" form="provider-form">
          {{ messages.save }}
        </WButton>

        <WButton
          accent="secondary"
          :disabled="!isFormChanged"
          class="ml-auto"
          @click="resetFormData"
        >
          {{ messages.cancel }}
        </WButton>
      </div>
    </template>
  </WSidebar>
</template>

<script>
import isEqual from 'lodash-es/isEqual';
import cloneDeep from 'lodash-es/cloneDeep';
import { WSidebar, WButton } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import WebServicesForm from '../../WebServicesForm.vue';
import Api from '../../../api';
import normalizeFormData from '../../../utils/normalizeFormData';

export default {
  name: 'NewProviderSidebar',
  components: {
    WSidebar,
    WButton,
    WebServicesForm,
  },
  inject: ['messages'],
  data() {
    return {
      isLoading: false,
      initialFormData: {},
      formData: {},
      newProviderControls: [],
    };
  },
  computed: {
    isFormChanged() {
      return !isEqual(this.formData, this.initialFormData);
    },
  },
  created() {
    this.getNewProvider();
  },
  methods: {
    setFormData(value, name) {
      this.$set(this.formData, name, value);
    },

    closeNewProviderSidebar() {
      this.$emit('close');
    },

    async getNewProvider() {
      this.isLoading = true;
      const result = await Api.getInstance().getNewProvider();
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data, meta }) => {
          this.formData = normalizeFormData(data, meta.config);
          this.initialFormData = cloneDeep(this.formData);
          this.newProviderControls = meta.config;
        },
      );
    },

    async saveFormData() {
      if (!this.$refs.form.$refs.form.validate()) return;

      this.isLoading = true;
      const result = await Api.getInstance().postNewProvider({
        providerData: this.formData,
      });
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data }) => {
          NoticeMessages.showSuccessNotice(data.message);
          this.$emit('create', data.provider);
          this.closeNewProviderSidebar();
        },
      );
    },

    resetFormData() {
      this.formData = cloneDeep(this.initialFormData);
    },
  },
};
</script>

<style lang="less" scoped>
.new-provider-sidebar {
  &__footer {
    display: flex;
  }
}
</style>

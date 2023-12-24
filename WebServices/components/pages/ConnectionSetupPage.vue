<template>
  <TabsLayout :tabs="preparedProviderTabs" :loading="isLoading" class="connection-setup">
    <template #header-top>
      <WebServicesBreadcrumbs class="mb-1" />
    </template>

    <template #title>
      <span v-html="currentTitle" />
    </template>

    <RouterView @change="setHasChanges" />

    <template v-if="visibleFooter" #footer>
      <WButton
        v-if="isEditable"
        :disabled="!hasChanges"
        type="submit"
        form="web-services-form"
        :icon="isAddMode ? 'end' : 'none'"
      >
        {{ buttonLabel }}

        <WIcon
          v-if="isAddMode"
          name="arrow-right-m"
          class="connection-setup__icon ml-1"
          width="24"
          height="24"
        />
      </WButton>

      <ConnectionSetupTimeInfo v-if="isShowingTime" :time-info="timeInfo" />
    </template>
  </TabsLayout>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { WButton, WIcon } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import createStoreModule from '../../store/modules/time-info';
import TabsLayout from '../layouts/TabsLayout.vue';
import WebServicesBreadcrumbs from '../WebServicesBreadcrumbs.vue';
import ConnectionSetupTimeInfo from '../connection-setup/ConnectionSetupTimeInfo.vue';
import { addConnectionId } from '../../const/connection';
import Api from '../../api';

const timeInfoNS = createNamespacedHelpers('time-info');

export default {
  name: 'ConnectionSetupPage',
  components: {
    TabsLayout,
    WebServicesBreadcrumbs,
    WButton,
    ConnectionSetupTimeInfo,
    WIcon,
  },
  inject: ['messages', 'config'],
  data() {
    return {
      hasChanges: false,
      isLoading: false,
      excludedProviderTabs: [],
    };
  },
  computed: {
    ...timeInfoNS.mapState(['timeInfo']),
    currentTitle() {
      return this.messages.providerSettings.replace(
        '{providerName}', `<br> ${this.$route.params.providerId}`,
      );
    },
    isAddMode() {
      return this.$route.params.connectionId === addConnectionId;
    },
    visibleProviderTabs() {
      return this.config.providerTabs.filter(
        ({ routeName }) => !this.excludedProviderTabs.includes(routeName),
      );
    },
    preparedProviderTabs() {
      if (!this.isAddMode) {
        return this.visibleProviderTabs;
      }

      return this.visibleProviderTabs.map((tab, index) => ({
        ...tab,
        disabled: index > 0,
      }));
    },
    visibleFooter() {
      return this.isEditable || this.isShowingTime;
    },
    isEditable() {
      return !!this.$route.meta.editable;
    },
    isShowingTime() {
      return !!this.$route.meta.showingTime && this.timeInfo;
    },
    buttonLabel() {
      const { connectionAttempt, save } = this.messages;

      return this.isAddMode ? connectionAttempt : save;
    },
  },
  watch: {
    $route() {
      this.setHasChanges(false);
    },
  },
  created() {
    this.fetchExcludedProviderTabs();

    if (!this.$store.hasModule('time-info')) {
      const storeModule = createStoreModule();
      this.$store.registerModule('time-info', storeModule);
    }
  },
  beforeDestroy() {
    this.$store.unregisterModule('time-info');
  },
  methods: {
    setHasChanges(val) {
      this.hasChanges = val;
    },
    /**
     * TODO: Рефакторинг. Избавиться от этого запроса, логику isWebOrderAvailable перенести на фронт
     */
    async fetchExcludedProviderTabs() {
      const { providerId } = this.$route.params;

      this.isLoading = true;
      const result = await Api.getInstance().getExcludedProviderTabs(providerId);
      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data }) => {
          this.excludedProviderTabs = data.excludedProviderTabs;
        },
      );
      this.isLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.connection-setup {
  &__icon {
    fill: var(--color-bg-primary);
  }
}
</style>

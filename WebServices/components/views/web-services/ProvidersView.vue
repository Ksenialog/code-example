<template>
  <div class="providers">
    <WSpinner v-if="isLoading" size="36" block />

    <WNotice v-else-if="providers.length === 0" type="warning">
      {{ messages.emptyStateTitle }}
    </WNotice>

    <div v-else class="providers__groups">
      <ProvidersGroup
        v-for="(group, i) in groups"
        :key="i"
        :title="group.title"
        :providers="group.providers"
        :active="group.active"
        :columns="columns"
        @connect-click="showConnectModal"
        @info-click="showInfoModal"
      >
        <template v-if="group.active" #after-activator>
          <ProvidersFilters :filters="filters" @change="onFiltersChange" />
        </template>
      </ProvidersGroup>
    </div>

    <ProviderConnectModal
      v-if="currentConnectProvider"
      :provider="currentConnectProvider"
      @close="hideConnectModal"
    />

    <ProviderInfoModal
      v-if="currentInfoProvider"
      :provider="currentInfoProvider"
      @close="hideInfoModal"
    />
  </div>
</template>

<script>
import { WSpinner, WNotice } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import ProvidersGroup from '../../web-services/providers/ProvidersGroup.vue';
import ProvidersFilters from '../../web-services/providers/ProvidersFilters.vue';
import ProviderConnectModal from '../../web-services/providers/ProviderConnectModal.vue';
import Api from '../../../api';
import * as providerStatus from '../../../const/providerStatus';

export default {
  name: 'ProvidersView',
  components: {
    WSpinner,
    WNotice,
    ProvidersGroup,
    ProvidersFilters,
    ProviderConnectModal,
    ProviderInfoModal: () => import(
      /* webpackChunkName: "ProviderInfoModal" */
      '../../web-services/providers/ProviderInfoModal.vue'
    ),
  },
  inject: ['messages'],
  data() {
    return {
      providers: [],
      filters: {
        title: '',
      },
      columns: [],
      isLoading: false,
      currentConnectProvider: null,
      currentInfoProvider: null,
    };
  },
  computed: {
    filteredProviders() {
      return this.providers.filter((provider) => {
        if (this.filters.title) {
          const titleRegex = new RegExp(`.*${this.filters.title}.*`, 'ig');
          return titleRegex.test(provider.title);
        }

        return true;
      });
    },
    activeProviders() {
      return this.filteredProviders.filter(
        ({ active, status }) => active && status !== providerStatus.NOT_CONFIGURED,
      );
    },
    inactiveProviders() {
      return this.filteredProviders.filter((provider) => !this.activeProviders.includes(provider));
    },
    groups() {
      const groups = [
        {
          title: this.messages.connected,
          providers: this.activeProviders,
          active: true,
        },
        {
          title: this.messages.notConnected,
          providers: this.inactiveProviders,
          active: false,
        },
      ];

      return groups;
    },
  },
  created() {
    this.getProviders();
  },
  methods: {
    async getProviders() {
      this.isLoading = true;
      const result = await Api.getInstance().getProviders();
      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data, meta }) => {
          this.providers = data;
          this.columns = meta.columns;
        },
      );
      this.isLoading = false;
    },
    showConnectModal(provider) {
      this.currentConnectProvider = provider;
    },
    hideConnectModal() {
      this.currentConnectProvider = null;
    },
    showInfoModal(provider) {
      this.currentInfoProvider = provider;
    },
    hideInfoModal() {
      this.currentInfoProvider = null;
    },
    onFiltersChange(filters) {
      this.filters = filters;
    },
  },
};
</script>

<style lang="less" scoped>
.providers {
  &__groups {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
}
</style>

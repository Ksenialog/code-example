<template>
  <div class="provider-connections">
    <header class="px-8 pt-6 mb-8">
      <WebServicesBreadcrumbs class="mb-1" />

      <h1 class="wt-h-1" v-html="currentTitle" />
    </header>

    <WSpinner v-if="isLoading" block size="36" />

    <template v-else>
      <div class="provider-connections__content px-8 pb-8">
        <ProviderConnectionsTable
          :columns="tableColumns"
          :connections="connections"
          @change-visibility="changeConnectionVisibility"
          @copy="onConnectionCopy"
          @delete="onConnectionDelete"
        />
      </div>

      <WebServicesFooter>
        <RouterLink :to="newConnectionRoute" custom>
          <template #default="{ navigate, href }">
            <WButton icon="start" accent="secondary" :href="href" @click="navigate">
              <WIcon width="24" height="24" name="button-add-m" class="mr-1" />

              {{ messages.newConnection }}
            </WButton>
          </template>
        </RouterLink>
      </WebServicesFooter>
    </template>
  </div>
</template>

<script>
import {
  WSpinner, WButton, WIcon,
} from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import ProviderConnectionsTable from '../provider-connections/ProviderConnectionsTable.vue';
import WebServicesFooter from '../WebServicesFooter.vue';
import Api from '../../api';
import WebServicesBreadcrumbs from '../WebServicesBreadcrumbs.vue';
import { CONNECTION_SETUP } from '../../const/routeName';
import { addConnectionId } from '../../const/connection';

export default {
  name: 'ProviderConnections',
  components: {
    WSpinner,
    WButton,
    WIcon,
    ProviderConnectionsTable,
    WebServicesFooter,
    WebServicesBreadcrumbs,
  },
  inject: ['messages'],
  data() {
    return {
      isLoading: false,
      connections: [],
      tableColumns: [],
    };
  },
  computed: {
    currentTitle() {
      return this.messages.providerTitle.replace(
        '{providerName}', `<br> ${this.$route.params.providerId}`,
      );
    },
    newConnectionRoute() {
      return {
        name: CONNECTION_SETUP,
        params: {
          connectionId: addConnectionId,
        },
      };
    },
  },
  created() {
    this.getProviderConnections();
  },
  methods: {
    async getProviderConnections() {
      this.isLoading = true;
      const response = await Api.getInstance().getProviderConnections(
        this.$route.params.providerId,
      );
      this.isLoading = false;
      response.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data, meta }) => {
          this.tableColumns = meta.columns;
          this.connections = data;
        },
      );
    },
    async changeConnectionVisibility(id) {
      const currentEl = this.connections.find((el) => el.datafile_id === id);
      currentEl.visibility = !currentEl.visibility;

      const response = await Api.getInstance().changeProviderConnectionVisibility({
        providerId: this.$route.params.providerId,
        connectionId: id,
      }, { visibility: currentEl.visibility });
      response.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data }) => NoticeMessages.showSuccessNotice(data.message),
      );
    },
    async onConnectionCopy(id) {
      const response = await Api.getInstance().copyProviderConnection({
        providerId: this.$route.params.providerId,
        connectionId: id,
      });
      response.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data }) => {
          NoticeMessages.showSuccessNotice(data.message);
          this.getProviderConnections();
        },
      );
    },
    async onConnectionDelete(id) {
      const response = await Api.getInstance().deleteProviderConnection({
        datafileId: id,
      });
      response.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data }) => {
          NoticeMessages.showSuccessNotice(data.message);
          this.connections = this.connections.filter((el) => el.datafile_id !== id);
        },
      );
    },
  },
};
</script>

<style lang="less" scoped>
.provider-connections {
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  height: 100%;
  overflow: hidden;

  &__content {
    height: 100%;
    overflow-y: auto;
  }
}
</style>

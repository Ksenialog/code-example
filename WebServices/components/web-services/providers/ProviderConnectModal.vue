<template>
  <WModal width="552px" @close="$emit('close')">
    <template #title>{{ messages.connectionModal.title }}</template>
    <template #subtitle>{{ provider.onlyAgreementText }}</template>

    <template #footer>
      <RouterLink custom :to="addProviderConnectionRoute">
        <template #default="{ href, navigate }">
          <WButton :href="href" class="mr-3" @click="navigate">
            {{ messages.connectionModal.continue }}
          </WButton>
        </template>
      </RouterLink>

      <WButton
        v-if="provider.siteUrl"
        accent="secondary"
        :href="provider.siteUrl"
        target="_blank"
      >
        {{ messages.connectionModal.goToProviderSite }}
      </WButton>
    </template>
  </WModal>
</template>

<script>
import { WModal, WButton } from '@tradesoft/war-ui';
import { CONNECTION_SETUP } from '../../../const/routeName';
import { addConnectionId } from '../../../const/connection';

export default {
  name: 'ProviderConnectModal',
  components: {
    WModal,
    WButton,
  },
  inject: ['messages'],
  props: {
    provider: {
      type: Object,
      required: true,
    },
  },
  computed: {
    addProviderConnectionRoute() {
      return {
        name: CONNECTION_SETUP,
        params: {
          providerId: this.provider.name,
          connectionId: addConnectionId,
        },
      };
    },
  },
};
</script>

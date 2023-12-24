<template>
  <div class="provider-connections-table-controls">
    <WSwitch v-model="modelVisibility" class="mr-4" />

    <RouterLink :to="testingRoute" custom>
      <template #default="{ navigate, href }">
        <WButton accent="secondary" :href="href" @click="navigate">
          {{ messages.test }}
        </WButton>
      </template>
    </RouterLink>

    <WButton
      :title="messages.copy"
      icon="only"
      accent="secondary"
      @click="$emit('copy')"
    >
      <WIcon width="24" height="24" name="button-copy-m" />
    </WButton>

    <RouterLink :to="editingRoute" custom>
      <template #default="{ navigate, href }">
        <WButton
          icon="only"
          accent="secondary"
          :title="messages.edit"
          :href="href"
          @click="navigate"
        >
          <WIcon width="24" height="24" name="button-edit-m" />
        </WButton>
      </template>
    </RouterLink>

    <WButton
      icon="only"
      accent="secondary"
      :title="messages.delete"
      @click="$emit('delete')"
    >
      <WIcon width="24" height="24" name="button-delete-m" />
    </WButton>
  </div>
</template>

<script>
import {
  WSwitch, WButton, WIcon,
} from '@tradesoft/war-ui';
import { CONNECTION_SETUP, CONNECTION_SETUP_TESTING } from '../../const/routeName';

export default {
  name: 'ProviderConnectionsTableControls',
  components: {
    WSwitch,
    WButton,
    WIcon,
  },
  inject: ['messages'],
  props: {
    visibility: {
      type: [Number, Boolean], required: true,
    },
    id: {
      type: Number, required: true,
    },
  },
  computed: {
    modelVisibility: {
      get() {
        return !!this.visibility;
      },
      set() {
        this.$emit('change-visibility');
      },
    },
    testingRoute() {
      return {
        name: CONNECTION_SETUP_TESTING,
        params: {
          connectionId: this.id,
        },
      };
    },
    editingRoute() {
      return {
        name: CONNECTION_SETUP,
        params: {
          connectionId: this.id,
        },
      };
    },
  },
};
</script>

<style lang="less" scoped>
.provider-connections-table-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}
</style>

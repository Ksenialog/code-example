<template>
  <WTable
    :rows="connections"
    :columns="columns"
    sticky-header
    column-name-key="key"
    class="provider-connections-table"
  >
    <template #cell(controls)="{ row: item }">
      <ProviderConnectionsTableControls
        :id="item.datafile_id"
        :visibility="item.visibility"
        @change-visibility="$emit('change-visibility', item.datafile_id)"
        @copy="$emit('copy', item.datafile_id)"
        @delete="$emit('delete', item.datafile_id)"
      />
    </template>

    <template #empty>
      <WEmptyState
        :title="messages.emptyStateTitle"
        :description="messages.emptyStateDescription"
      />
    </template>
  </WTable>
</template>

<script>
import { WTable, WEmptyState } from '@tradesoft/war-ui';
import ProviderConnectionsTableControls from './ProviderConnectionsTableControls.vue';

export default {
  name: 'ProviderConnectionsTable',
  components: {
    WTable,
    WEmptyState,
    ProviderConnectionsTableControls,
  },
  inject: ['messages'],
  props: {
    columns: { type: Array, required: true },
    connections: { type: Array, required: true },
  },
};
</script>

<style lang="less" scoped>
.provider-connections-table {
  max-width: 991px;
}
</style>

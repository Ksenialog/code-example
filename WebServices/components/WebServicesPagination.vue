<template>
  <WPagination
    :page="page"
    :total-items="totalItems"
    :per-page="perPage"
    :per-page-items="config.rowsPerPageList"
    :messages="messages.pagination"
    :loading="isLoading"
    @change="setPerPage"
    @change-pagination="setPage"
  />
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { WPagination } from '@tradesoft/war-ui';
import createStoreModule from '../store/modules/pagination';

const paginationNS = createNamespacedHelpers('pagination');

export default {
  name: 'WebServicesPagination',
  components: {
    WPagination,
  },
  inject: ['config', 'messages'],
  computed: {
    ...paginationNS.mapState(['page', 'perPage', 'totalItems', 'isLoading']),
  },
  created() {
    if (!this.$store.hasModule('pagination')) {
      const storeModule = createStoreModule({
        perPage: this.config.rowsPerPageList[0],
      });
      this.$store.registerModule('pagination', storeModule);
    }
  },
  beforeDestroy() {
    this.$store.unregisterModule('pagination');
  },
  methods: {
    ...paginationNS.mapActions(['setPage', 'setPerPage']),
  },
};
</script>

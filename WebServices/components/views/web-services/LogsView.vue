<template>
  <div class="logs">
    <LogsFilters
      v-if="filtersConfig"
      :filters="filters"
      :filters-config="filtersConfig"
      class="mb-8"
      @apply="applyFilters"
    />

    <WSpinner v-if="isLoading" :size="36" block />

    <template v-else>
      <RecycleScroller
        :items="logs"
        :item-size="49"
        key-field="id"
        page-mode
        :buffer="130"
      >
        <template #default="{ itemsPool: visibleLogs, sizeBefore, sizeAfter }">
          <WTable
            :rows="visibleLogs"
            :columns="columns"
            sticky-header
            :virtual="!isLoading"
            :virtual-size-before="sizeBefore"
            :virtual-size-after="sizeAfter"
            fixed
            class="logs__table"
          >
            <colgroup>
              <col
                v-for="column in columns"
                :key="column.name"
                :style="getColStyle(column)"
              >
            </colgroup>

            <template #cell()="{ value }">
              <span data-line-clamp="1" :title="value">{{ value }}</span>
            </template>

            <template #cell(summary)="{ row: log }">
              <WLink view="button" class="wt-control-m" @click="showSummaryInfoModal(log)">
                {{ messages.show }}
              </WLink>
            </template>

            <template #empty>
              <WEmptyState
                :title="messages.emptyStateTitle"
                :description="messages.emptyStateDescription"
              />
            </template>
          </WTable>
        </template>
      </RecycleScroller>

      <SummaryInfoLogModal
        v-if="currentSummaryInfoLog"
        :log="currentSummaryInfoLog"
        @close="hideSummaryInfoModal"
      />
    </template>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import {
  WSpinner, WTable, WLink, WEmptyState,
} from '@tradesoft/war-ui';
import { RecycleScroller } from '@tradesoft/war-vendor/vue-virtual-scroller';
import NoticeMessages from 'Common/Components/NoticeMessages';
import LogsFilters from '../../web-services/logs/LogsFilters.vue';
import Api from '../../../api';

const paginationNS = createNamespacedHelpers('pagination');

export default {
  name: 'LogsView',
  components: {
    WSpinner,
    WTable,
    WLink,
    WEmptyState,
    RecycleScroller,
    LogsFilters,
    SummaryInfoLogModal: () => import(
      /* webpackChunkName: "SummaryInfoLogModal" */
      '../../web-services/logs/SummaryInfoLogModal.vue'
    ),
  },
  inject: ['messages'],
  data() {
    return {
      logs: [],
      columns: null,
      filtersConfig: null,
      filters: {
        area: null,
        provider: null,
        dateFrom: null,
        dateTo: null,
      },
      currentSummaryInfoLog: null,
    };
  },
  computed: {
    ...paginationNS.mapState(['page', 'perPage', 'isLoading']),
  },
  watch: {
    page() {
      this.getLogs();
    },
    perPage() {
      this.getLogs();
    },
  },
  mounted() {
    this.getLogs();
  },
  methods: {
    ...paginationNS.mapActions(['setTotalItems', 'setIsLoading']),
    async getLogs() {
      if (this.isLoading) return;

      this.setIsLoading(true);
      const result = await Api.getInstance().getLogs({
        ...this.filters,
        page: this.page,
        limit: this.perPage,
      });

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data, meta }) => {
          this.logs = data;
          this.setTotalItems(meta.logCount);

          if (this.filtersConfig && this.columns) return;

          this.filtersConfig = meta.filterList;
          this.columns = meta.columnList;
        },
      );
      this.setIsLoading(false);
    },
    applyFilters(filters) {
      this.filters = filters;
      this.getLogs();
    },
    showSummaryInfoModal(log) {
      this.currentSummaryInfoLog = log;
    },
    hideSummaryInfoModal() {
      this.currentSummaryInfoLog = null;
    },
    getColStyle(column) {
      return {
        width: column.width,
        minWidth: column.minWidth,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.logs {
  &__table {
    /deep/ .w-table-row_sticky {
      top: -40px;
    }
  }
}
</style>

<template>
  <RecycleScroller
    :items="preparedProducts"
    :item-size="isFullTable ? 25 : 49"
    key-field="index"
    page-mode
    :buffer="99"
  >
    <template #default="{ itemsPool: visibleProducts, sizeBefore, sizeAfter }">
      <WTable
        :rows="visibleProducts"
        :columns="columns"
        :compact="isFullTable"
        sticky-header
        virtual
        :virtual-size-before="sizeBefore"
        :virtual-size-after="sizeAfter"
        fixed
        class="testing-table"
      >
        <colgroup>
          <col
            v-for="column in columns"
            :key="column.name"
            :style="`width: ${column.width}`"
          >
        </colgroup>

        <template #cell()="{ value }">
          <span data-line-clamp="1" :title="value">{{ value }}</span>
        </template>

        <template v-if="!isFullTable" #cell(producer)="{ value, row }">
          <WLink
            view="tooltip"
            class="wt-control-m testing-table__link"
            data-line-clamp="1"
            :title="value"
            @click="$emit('select', {code: row.code, producer: value})"
          >
            {{ value }}
          </WLink>
        </template>

        <template #cell(isUsed)="{ value, row }">
          <WLink v-if="value" @click="$emit('click-on-used', row.providercode)">
            <WIcon width="24" height="16" name="button-info-m" />
          </WLink>

          <WIcon v-else width="24" height="16" name="availability-off-m" />
        </template>

        <template #cell(isDealer)="{ value }">
          <WIcon width="24" height="16" :name="getDealerIcon(value)" />
        </template>
      </WTable>
    </template>
  </RecycleScroller>
</template>

<script>
import { WTable, WLink, WIcon } from '@tradesoft/war-ui';
import { RecycleScroller } from '@tradesoft/war-vendor/vue-virtual-scroller';

export default {
  name: 'TestingTable',
  components: {
    WTable,
    WLink,
    WIcon,
    RecycleScroller,
  },
  props: {
    columns: { type: Array, required: true },
    products: { type: Array, required: true },
    isFullTable: { type: Boolean, default: false },
  },
  computed: {
    /* Т.к. в результатах поиска нет уникального ключа, добавляем index для виртуализации */
    preparedProducts() {
      return this.products.map((item, index) => ({
        ...item,
        index,
      }));
    },
  },
  methods: {
    getDealerIcon(isDealer) {
      return isDealer ? 'availability-on-m' : 'availability-off-m';
    },
  },
};
</script>

<style lang="less" scoped>
.testing-table {
  /deep/ .w-table-row_sticky {
    top: -40px;
  }

  &__link {
    max-width: 100%;
    white-space: nowrap;
  }
}
</style>

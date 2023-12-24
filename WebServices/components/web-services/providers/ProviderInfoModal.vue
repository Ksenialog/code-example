<template>
  <WModal :loading="isLoading" width="912px" class="provider-info-modal" @close="$emit('close')">
    <template #title>{{ provider.title }}</template>

    <div v-if="infoColumns.length" class="provider-info-modal__info mb-6">
      <div v-for="(column, index) in infoColumns" :key="index" data-test-id="info-column">
        <div class="wt-caption">{{ column.label }}</div>
        <div class="wt-h-3">{{ column.value }}</div>
      </div>
    </div>

    <div v-if="provider.description" class="wt-control-m mb-8">{{ provider.description }}</div>

    <ProviderStatisticChart
      v-if="requestStatistics.length"
      :title="messages.totalRequestsCount"
      :statistics="requestStatistics"
      class="mb-6"
    />
    <ProviderStatisticChart
      v-if="latencyStatistics.length"
      :title="messages.providerLatency"
      :statistics="latencyStatistics"
    />
  </WModal>
</template>

<script>
import { WModal } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import ProviderStatisticChart from './ProviderStatisticChart.vue';
import Api from '../../../api';
import prepareProviderStatistics from '../../../utils/prepareProviderStatistics';

export default {
  name: 'ProviderInfoModal',
  components: {
    WModal,
    ProviderStatisticChart,
  },
  inject: ['messages'],
  props: {
    provider: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      requestStatistics: [],
      latencyStatistics: [],
    };
  },
  computed: {
    infoColumns() {
      const { activeTo, regionList } = this.provider;
      const columns = [];

      if (activeTo) {
        columns.push({
          value: activeTo,
          label: this.messages.disconnectDate,
        });
      }

      if (regionList) {
        columns.push({
          value: Object.values(regionList).join(', '),
          label: this.messages.regionUse,
        });
      }

      return columns;
    },
  },
  async created() {
    this.isLoading = true;
    const result = await Api.getInstance().getProviderStatistics(this.provider.name);
    result.either(
      ({ message }) => NoticeMessages.showErrorNotice(message),
      ({ data }) => {
        this.requestStatistics = prepareProviderStatistics(data.requestCountData ?? []);
        this.latencyStatistics = prepareProviderStatistics(data.latencyData ?? []);
      },
    );
    this.isLoading = false;
  },
};
</script>

<style lang="less" scoped>
.provider-info-modal {
  &__info {
    display: flex;
    gap: 40px;
  }
}
</style>

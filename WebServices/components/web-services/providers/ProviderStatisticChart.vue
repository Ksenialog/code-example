<template>
  <div class="provider-statistic-chart">
    <h3 class="wt-h-3 mb-4">{{ title }}</h3>

    <LineChart
      :chart-data="chartData"
      :chart-options="chartOptions"
      :plugins="$options.plugins"
      :width="760"
      :height="264"
    />
  </div>
</template>

<script>
import {
  Chart, LineElement, PointElement, TimeScale, LinearScale, Decimation,
} from 'chart.js';
import { Line as LineChart } from 'vue-chartjs/legacy';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';

Chart.register(LineElement, PointElement, TimeScale, LinearScale, Decimation);

const bodyStyle = getComputedStyle(document.body);

const colorBgPrimary = bodyStyle.getPropertyValue('--color-bg-primary');
const colorLink = bodyStyle.getPropertyValue('--color-link');

export default {
  name: 'ProviderStatisticChart',
  components: {
    LineChart,
  },
  plugins: ['decimation'],
  props: {
    title: {
      type: String,
      required: true,
    },
    statistics: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    chartData() {
      return {
        datasets: [{
          data: this.statistics,
        }],
      };
    },
    /** @returns {import('chart.js').ChartOptions} */
    chartOptions() {
      return {
        animation: false,
        parsing: false,
        scales: {
          x: {
            type: 'time',
            ticks: {
              autoSkipPadding: 8,
              maxRotation: 0,
            },
            time: {
              minUnit: 'second',
              displayFormats: {
                hour: 'HH:mm:ss',
              },
            },
          },
        },
        elements: {
          point: {
            backgroundColor: colorBgPrimary,
            borderColor: colorLink,
          },
          line: {
            borderColor: colorLink,
          },
        },
        plugins: {
          decimation: {
            enabled: true,
            algorithm: 'lttb',
            samples: 50,
            threshold: 1,
          },
        },
      };
    },
  },
};
</script>

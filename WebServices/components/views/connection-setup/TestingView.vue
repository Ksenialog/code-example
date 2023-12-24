<template>
  <WSpinner v-if="isLoading" size="36" block />

  <div v-else class="testing">
    <TestingSearch
      v-model.trim="codeValue"
      :example-links="exampleCodes"
      @search="testWithCodeValue"
    />

    <WNotice
      v-for="(notice, idx) in allNotices"
      :key="idx"
      :type="notice.type"
      class="wt-control-m my-6 testing__notice"
      size="sm"
    >
      {{ notice.message }}

      <WLink
        v-if="notice.link"
        view="tooltip"
        class="wt-control-m"
        @click="testWithCodeValue(notice.code)"
      >
        {{ notice.link }}
      </WLink>
    </WNotice>

    <TestingTable
      v-if="products.length"
      :products="products"
      :columns="columns"
      :is-full-table="!!producerValue"
      class="mt-8"
      @select="testWithProducerValue"
      @click-on-used="showUsedPartsInfo"
    />

    <TestingModal
      v-if="isModalOpened"
      :producer-code="producerCode"
      @close="toggleModal(false)"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { WSpinner, WNotice, WLink } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import Api from '../../../api';
import TestingSearch from '../../connection-setup/testing/TestingSearch.vue';
import TestingTable from '../../connection-setup/testing/TestingTable.vue';

const timeInfoNS = createNamespacedHelpers('time-info');

/**
 * @param {string | number} time
 */
const formatTime = (time) => Number(Number(time).toFixed(3));

export default {
  name: 'TestingView',
  components: {
    WSpinner,
    TestingSearch,
    TestingTable,
    TestingModal: () => import(
      /* webpackChunkName: "TestingModal" */
      '../../connection-setup/testing/TestingModal.vue'
    ),
    WNotice,
    WLink,
  },
  inject: ['messages'],
  data() {
    return {
      isLoading: false,
      codeValue: '',
      producerValue: '',
      producerCode: '',
      exampleCodes: [],
      columns: [],
      products: [],
      errorList: [],
      noticeList: [],
      isModalOpened: false,
    };
  },
  computed: {
    allNotices() {
      const allNotices = [];

      this.errorList.forEach((err) => {
        allNotices.push({
          type: 'error',
          message: err,
        });
      });

      this.noticeList.forEach((notice) => {
        allNotices.push({
          type: 'warning',
          message: notice.message.replace('{code}', notice.code),
          link: notice.link?.replace('{code}', notice.code),
          code: notice.code,
        });
      });

      return allNotices;
    },
  },
  created() {
    this.getTestingTabData();
  },
  beforeDestroy() {
    this.setTimeInfo(null);
  },
  methods: {
    ...timeInfoNS.mapActions(['setTimeInfo']),
    async getTestingTabData() {
      const { name } = this.$route;
      const { providerId, connectionId } = this.$route.params;

      this.isLoading = true;
      const result = await Api.getInstance().getProviderTab({
        tabName: name,
        providerName: providerId,
        datafileId: connectionId,
      });
      this.isLoading = false;

      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ meta }) => {
          this.exampleCodes = meta.config.links;
        },
      );
    },
    async testProviderConnection() {
      const { providerId, connectionId } = this.$route.params;

      const startTime = Date.now() / 1000;
      this.isLoading = true;
      this.setTimeInfo(null);

      const result = await Api.getInstance().testProviderConnection(
        providerId,
        {
          datafile_id: connectionId,
          code: this.codeValue,
          producer: this.producerValue,
        },
      );

      this.isLoading = false;
      result.either(
        ({ message }) => NoticeMessages.showErrorNotice(message),
        ({ data }) => {
          const {
            columnList,
            errorList,
            noticeList,
            result: products,
            dataReadyTime,
            transferTime,
          } = data;
          this.products = products ?? [];
          this.columns = columnList ?? [];
          this.errorList = errorList;
          this.noticeList = noticeList;

          const endTime = Date.now() / 1000;
          const totalTime = formatTime(endTime - startTime);
          const pageGenerationTime = formatTime(totalTime - transferTime);
          const timeInfoData = this.products.length ? {
            dataReadyTime: formatTime(dataReadyTime),
            transferTime: formatTime(transferTime),
            pageGenerationTime,
            totalTime,
          } : null;

          this.setTimeInfo(timeInfoData);
        },
      );
    },
    setTestCode(value) {
      this.codeValue = value;
    },
    setTestProducer(value) {
      this.producerValue = value;
    },
    testWithCodeValue(value = this.codeValue) {
      this.setTestCode(value);
      this.setTestProducer('');
      this.testProviderConnection();
    },
    testWithProducerValue(data) {
      this.setTestCode(data.code);
      this.setTestProducer(data.producer);
      this.testProviderConnection();
    },
    toggleModal(value) {
      this.isModalOpened = value;
    },
    setProducerCode(value) {
      this.producerCode = value;
    },
    showUsedPartsInfo(producerCode) {
      this.toggleModal(true);
      this.setProducerCode(producerCode);
    },
  },
};
</script>

<style lang="less" scoped>
.testing {
  &__notice {
    max-width: 821px;
  }
}
</style>

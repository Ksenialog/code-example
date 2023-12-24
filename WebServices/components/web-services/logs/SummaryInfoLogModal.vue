<template>
  <WModal :loading="isLoading" width="auto" @close="$emit('close')">
    <template #title>{{ messages.summaryInfo }}</template>

    <pre class="wt-control-m m-0" v-html="prettifiedSummaryInfo" />
  </WModal>
</template>

<script>
import { WModal } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import Api from '../../../api';

export default {
  name: 'SummaryInfoLogModal',
  components: {
    WModal,
  },
  inject: ['messages'],
  props: {
    log: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      summaryInfo: null,
    };
  },
  computed: {
    prettifiedSummaryInfo() {
      return JSON.stringify(this.summaryInfo, null, 4);
    },
  },
  async created() {
    this.isLoading = true;
    const result = await Api.getInstance().getLogInfo(this.log.id);
    result.either(
      ({ message }) => NoticeMessages.showErrorNotice(message),
      ({ data }) => {
        this.summaryInfo = data;
      },
    );
    this.isLoading = false;
  },
};
</script>

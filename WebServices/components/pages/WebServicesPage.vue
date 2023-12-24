<template>
  <TabsLayout :tabs="config.webServicesTabs">
    <template #title>
      {{ messages.title }}
    </template>

    <RouterView
      @change="setHasChanges"
    />

    <template v-if="visibleFooter" #footer>
      <WButton
        v-if="isEditable"
        :disabled="!hasChanges"
        type="submit"
        form="web-services-form"
      >
        {{ messages.save }}
      </WButton>

      <WButton
        v-if="isTestable"
        :disabled="isButtonDisabled"
        type="button"
        accent="secondary"
        @click="setIsModalOpen(true)"
      >
        {{ messages.test }}
      </WButton>

      <WebServicesPagination v-if="isPaginatable" class="ml-auto" />
    </template>
  </TabsLayout>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { WButton } from '@tradesoft/war-ui';
import createStoreModule from '../../store/modules/testing';
import TabsLayout from '../layouts/TabsLayout.vue';
import WebServicesPagination from '../WebServicesPagination.vue';

const testingNS = createNamespacedHelpers('testing');

export default {
  name: 'WebServicesPage',
  components: {
    WButton,
    TabsLayout,
    WebServicesPagination,
  },
  inject: ['config', 'messages'],
  data() {
    return {
      hasChanges: false,
    };
  },
  computed: {
    ...testingNS.mapState(['isButtonDisabled']),
    visibleFooter() {
      return this.isPaginatable || this.isTestable || this.isEditable;
    },
    isEditable() {
      return !!this.$route.meta.editable;
    },
    isPaginatable() {
      return !!this.$route.meta.paginatable;
    },
    isTestable() {
      return !!this.$route.meta.testable;
    },
  },
  watch: {
    $route() {
      this.hasChanges = false;
    },
  },
  created() {
    if (!this.$store.hasModule('testing')) {
      const storeModule = createStoreModule();
      this.$store.registerModule('testing', storeModule);
    }
  },
  beforeDestroy() {
    this.$store.unregisterModule('testing');
  },
  methods: {
    ...testingNS.mapActions(['setIsModalOpen']),
    setHasChanges(val) {
      this.hasChanges = val;
    },
  },
};
</script>

<template>
  <div class="tabs-layout">
    <header class="tabs-layout__header pt-6 px-8">
      <slot name="header-top" />

      <h1 v-if="$scopedSlots.title" class="wt-h-1 mb-4">
        <slot name="title" />
      </h1>

      <WSkeleton v-if="loading" height="31px" />

      <WTabs v-else class="tabs-layout__tabs">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.routeName"
          :to="tab.routeName"
          custom
        >
          <template #default="{ href, navigate }">
            <WTabsBtn
              :href="isTabActive(tab) ? null : href"
              :active="isTabActive(tab)"
              :disabled="tab.disabled"
              @click="navigate"
            >
              {{ tab.title }}
            </WTabsBtn>
          </template>
        </RouterLink>
      </WTabs>
    </header>

    <div class="tabs-layout__content" :class="contentClasses">
      <slot v-if="!loading" />
    </div>

    <WebServicesFooter v-if="$scopedSlots.footer">
      <slot name="footer" />
    </WebServicesFooter>
  </div>
</template>

<script>
import { WTabs, WTabsBtn, WSkeleton } from '@tradesoft/war-ui';
import { WEBSERVICES_WEB_ORDER } from '../../const/routeName';
import WebServicesFooter from '../WebServicesFooter.vue';

export default {
  name: 'TabsLayout',
  components: {
    WTabs,
    WTabsBtn,
    WSkeleton,
    WebServicesFooter,
  },
  props: {
    tabs: { type: Array, required: true },
    loading: { type: Boolean, default: false },
  },
  computed: {
    contentClasses() {
      if (this.$route.name === WEBSERVICES_WEB_ORDER) {
        return null;
      }

      return ['px-8', 'py-10'];
    },
  },
  methods: {
    isTabActive(tab) {
      return tab.routeName === this.$route.name;
    },
  },
};
</script>

<style lang="less" scoped>
.tabs-layout {
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  height: 100%;

  &__header {
    background-color: var(--color-bg-secondary);
  }

  &__tabs {
    margin-inline: -32px;

    /deep/ .w-tabs__tabs {
      padding-inline: 32px;
    }
  }

  &__content {
    overflow-y: auto;
  }
}
</style>

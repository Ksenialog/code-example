<template>
  <div class="web-services-breadcrumbs">
    <div v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      <RouterLink custom :to="breadcrumb.to">
        <template #default="{ href, navigate }">
          <WLink view="button" :href="href" class="wt-control-m" @click="navigate">
            {{ breadcrumb.title }}
          </WLink>
        </template>
      </RouterLink>

      <span class="web-services-breadcrumbs__separator px-1">/</span>
    </div>
  </div>
</template>

<script>
import { WLink } from '@tradesoft/war-ui';

export default {
  name: 'WebServicesBreadcrumbs',
  components: {
    WLink,
  },
  inject: ['messages'],
  computed: {
    breadcrumbs() {
      const routeWithBreadcrumbs = this.$route.matched.find(({ meta }) => meta?.breadcrumbs);

      return (routeWithBreadcrumbs?.meta.breadcrumbs ?? []).map((breadcrumb) => ({
        ...breadcrumb,
        title: this.messages.breadcrumbs[breadcrumb.titleKey],
      }));
    },
  },
};
</script>

<style lang="less" scoped>
.web-services-breadcrumbs {
  display: flex;
  gap: 4px;

  &__separator {
    color: var(--color-text-tertiary);
  }
}
</style>

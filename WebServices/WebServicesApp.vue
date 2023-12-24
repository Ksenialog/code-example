<template>
  <RouterView />
</template>

<script>
export default {
  name: 'WebServicesApp',
  provide() {
    const {
      messages,
      config,
    } = this;

    return {
      messages,
      config,
    };
  },
  props: {
    config: {
      type: Object,
      required: true,
    },
    messages: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="less">
.main-admin {
  &__content {
    padding: 0;
  }
}
</style>

<template>
  <div class="web-services-switch">
    <div class="web-services-switch__wrapper">
      <h2 class="wt-h-3">{{ label }}</h2>

      <slot name="controls" />
    </div>
    <p
      v-if="subLabel"
      class="web-services-switch__sub-title wt-control-m mt-2"
    >
      {{ subLabel }}
    </p>
  </div>
</template>

<script>

export default {
  name: 'WebServicesSwitch',
  props: {
    label: { type: String, required: true },
    subLabel: { type: String, default: '' },
  },
};
</script>

<style lang="less" scoped>
.web-services-switch {
  &__wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__sub-title {
    max-width: 528px;
    color: var(--text-color-text-secondary);
  }
}
</style>

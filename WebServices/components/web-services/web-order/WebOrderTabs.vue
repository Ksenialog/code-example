<template>
  <div class="web-order-tabs">
    <div class="web-order-tabs__wrapper">
      <button
        v-for="{ title, name } in tabs"
        :key="name"
        type="button"
        class="web-order-tabs__tab wt-control-m"
        :class="{ 'web-order-tabs__tab_active': name === active }"
        @click="$emit('change', name)"
      >
        {{ title }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebOrderTabs',
  props: {
    tabs: { type: Array, default: () => ([]) },
    active: { type: String, required: true },
  },
};
</script>

<style lang="less" scoped>
.web-order-tabs {
  height: 100%;
  border-inline-end: 1px solid var(--color-bg-tertiary);

  &__wrapper {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
  }

  &__tab {
    padding: 12px 0;
    padding-inline-start: 32px;
    padding-inline-end: 16px;
    color: var(--w-tabs-btn-color, var(--color-text));
    white-space: nowrap;
    text-align: start;
    text-decoration: none;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    transition: background-color 0.15s;

    &_active {
      background-color: var(--color-bg-tertiary);
      pointer-events: none;
    }

    &:not(&_active):not(&_disabled):hover {
      background-color: var(--color-bg-secondary);
    }

    &:focus-visible {
      outline: 1px solid var(--color-bg-secondary-contrast);
    }
  }
}
</style>

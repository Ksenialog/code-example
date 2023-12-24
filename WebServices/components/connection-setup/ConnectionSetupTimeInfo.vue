<template>
  <div class="connection-setup-time-info">
    <p
      v-for="(value, key) in timeInfo"
      :key="key"
      class="connection-setup-time-info__text wt-control-m m-0"
    >
      {{ messages[key] }}: <span>{{ value }} {{ messages.seconds }}</span>
    </p>
  </div>
</template>

<script>

export default {
  name: 'ConnectionSetupTimeInfo',
  inject: ['messages'],
  props: {
    timeInfo: { type: Object, default: null },
  },
};
</script>

<style lang="less" scoped>
.connection-setup-time-info {
  display: flex;
  gap: 24px;

  &__text {
    color: var(--color-text-tertiary);

    span {
      color: var(--color-text);
    }
  }
}
</style>

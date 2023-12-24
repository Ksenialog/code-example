<template>
  <footer class="web-services-footer px-8 py-3">
    <slot />
  </footer>
</template>

<script>
export default {
  name: 'WebServicesFooter',
};
</script>

<style lang="less" scoped>
.web-services-footer {
  display: flex;
  align-items: center;
  min-height: 64px;
  background-color: var(--color-bg-secondary);
  gap: 8px;
}
</style>

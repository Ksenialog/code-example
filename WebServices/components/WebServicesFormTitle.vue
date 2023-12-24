<template>
  <h2 class="wt-h-3">
    {{ label }}
  </h2>
</template>

<script>
export default {
  name: 'WebServicesFormTitle',
  props: {
    label: { type: String, required: true },
  },
};
</script>

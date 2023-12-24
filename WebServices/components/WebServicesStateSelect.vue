<template>
  <WSelect
    v-model="model"
    v-bind="$attrs"
  >
    <template #selection="{ item }">
      <WStateBadge :style="item.value">{{ item.value }}</WStateBadge>
    </template>

    <template #item="{ item }">
      <WStateBadge :style="item.value">{{ item.value }}</WStateBadge>
    </template>
  </WSelect>
</template>

<script>
import {
  WSelect,
  WStateBadge,
} from '@tradesoft/war-ui';

export default {
  name: 'WebServicesStateSelect',
  components: {
    WSelect,
    WStateBadge,
  },
  model: {
    event: 'change',
  },
  props: {
    value: { type: null, required: true },
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('change', value);
      },
    },
  },
};
</script>

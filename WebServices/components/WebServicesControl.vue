<template>
  <component
    :is="control.templateId"
    v-model="model"
    v-bind="control"
    :rules="control.required
      ? [({ value }) => !!value || messages.validatorMessages.required]
      : []"
    class="web-services-control"
  >
    <template v-if="control.append" #append>
      <span class="web-services-control__append wt-control-m">
        {{ control.append }}
      </span>
    </template>
  </component>
</template>

<script>
import {
  WInput,
  WCheckbox,
  WSelect,
  WSelectSearch,
  WTextArea,
  WTokenList,
  WRadioGroup,
  WSwitch,
} from '@tradesoft/war-ui';
import WebServicesStateSelect from './WebServicesStateSelect.vue';

export default {
  name: 'WebServicesControl',
  components: {
    WInput,
    WCheckbox,
    WSelect,
    WSelectSearch,
    WTextArea,
    WTokenList,
    WRadioGroup,
    WSwitch,
    WebServicesStateSelect,
  },
  inject: ['messages'],
  props: {
    control: { type: Object, required: true },
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

<style lang="less" scoped>
.web-services-control {
  &__append {
    color: var(--color-text-tertiary);
  }
}
</style>

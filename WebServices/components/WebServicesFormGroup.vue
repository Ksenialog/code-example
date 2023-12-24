<template>
  <WFormGroup
    :content-size="contentSize"
    :divider="divider"
    class="web-services-form-group"
    :large-label="largeLabel"
  >
    <template #label>
      <div class="web-services-form-group__label">
        <span>{{ label }}</span>

        <WTooltip v-if="hint" mode="hover" width="auto">
          <button class="web-services-form-group__tooltip" type="button">
            <WIcon class="web-services-form-group__tooltip-icon" name="tooltip-s" />
          </button>

          <template #tooltip>
            <div
              class="web-services-form-group__tooltip-content"
              v-html="hint"
            />
          </template>
        </WTooltip>
      </div>
    </template>

    <template #sublabel>{{ subLabel }}</template>

    <slot name="controls" />
  </WFormGroup>
</template>

<script>
import {
  WTooltip,
  WIcon,
  WFormGroup,
} from '@tradesoft/war-ui';

export default {
  name: 'WebServicesFormGroup',
  components: {
    WTooltip,
    WIcon,
    WFormGroup,
  },
  props: {
    label: { type: String, default: '' },
    subLabel: { type: String, default: null },
    hint: { type: String, default: null },
    contentSize: { type: Number, default: 4 },
    divider: { type: Boolean, default: false },
    largeLabel: { type: Boolean, default: true },
  },
};
</script>

<style lang="less" scoped>
.web-services-form-group {
  &__tooltip {
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
  }

  &__tooltip-icon {
    fill: var(--color-bg-primary);
  }

  &__tooltip-content {
    max-width: 288px;
  }
}
</style>

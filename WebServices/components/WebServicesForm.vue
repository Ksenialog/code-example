<template>
  <div class="web-services-form">
    <WebServicesFormTitle v-if="title" :label="title" class="mb-8" />

    <WForm
      :id="formId"
      ref="form"
      class="web-services-form__form"
      @submit="submitForm"
    >
      <div
        v-for="(item, index) in preparedItems"
        :key="index"
        class="web-services-form__control-wrapper"
      >
        <component
          :is="item.templateId ?? 'WebServicesFormGroup'"
          v-bind="item"
        >
          <template #controls>
            <div class="web-services-form__control-wrapper">
              <WebServicesControl
                v-for="control in item.controls"
                :key="control.name"
                :control="control"
                :value="formData[control.name]"
                class="web-services-form__control"
                @change="changeWebServicesControl($event, control.name)"
              />
            </div>
          </template>
        </component>

        <slot
          name="after-control"
          :item="item"
        />
      </div>
    </WForm>
  </div>
</template>

<script>
import { WForm } from '@tradesoft/war-ui';
import WebServicesSwitch from './WebServicesSwitch.vue';
import WebServicesFormGroup from './WebServicesFormGroup.vue';
import WebServicesFormTitle from './WebServicesFormTitle.vue';
import WebServicesControl from './WebServicesControl.vue';

export default {
  name: 'WebServicesForm',
  components: {
    WForm,
    WebServicesSwitch,
    WebServicesFormGroup,
    WebServicesFormTitle,
    WebServicesControl,
  },
  props: {
    title: { type: String, default: '' },
    items: { type: Array, required: true },
    formData: { type: Object, required: true },
    formId: { type: String, default: 'web-services-form' },
  },
  computed: {
    preparedItems() {
      return this.items.filter((item) => {
        if (!item.controls) return true;

        return item.controls.some((control) => {
          if (!('criteria' in control)) return true;

          const criterion = Object.entries(control.criteria);
          return criterion.some(
            ([key, value]) => (value.includes(this.formData[key])),
          );
        });
      });
    },
  },
  methods: {
    changeWebServicesControl(value, name) {
      this.$emit('change', value, name);
    },
    submitForm() {
      this.$emit('submit');
    },
  },
};
</script>

<style lang="less" scoped>
.web-services-form {
  &__form {
    display: grid;
    gap: 24px;
  }

  &__control-wrapper {
    display: flex;
    gap: 8px;
  }

  &__control {
    flex-grow: 1;
  }
}
</style>

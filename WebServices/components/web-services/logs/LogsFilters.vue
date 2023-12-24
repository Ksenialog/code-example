<template>
  <WForm class="logs-filters" @submit="$emit('apply', localFilters)">
    <WSelect
      v-model="localFilters.area"
      :items="filtersConfig.area"
      object-mode
      :label="messages.errorType"
      class="logs-filters__select"
      clearable
    />

    <WSelectSearch
      v-model="localFilters.provider"
      :items="filtersConfig.provider"
      object-mode
      :messages="messages.wSelect"
      :label="messages.provider"
      class="logs-filters__select"
      clearable
    />

    <div class="logs-filters__period">
      <span class="wt-control-m mr-4">{{ messages.period }}</span>

      <WDatetimePicker
        v-bind="config.datetimePickerConfig"
        v-model="localFilters.dateFrom"
        :label="messages.from"
        format="YYYY-MM-DD HH:mm:ss"
        class="logs-filters__date-picker"
      />

      <span class="wt-control-m px-1">–</span>

      <WDatetimePicker
        v-bind="config.datetimePickerConfig"
        v-model="localFilters.dateTo"
        :label="messages.to"
        format="YYYY-MM-DD HH:mm:ss"
        class="logs-filters__date-picker"
      />
    </div>

    <WButton accent="secondary" type="submit" class="logs-filters__button">
      {{ messages.apply }}
    </WButton>
  </WForm>
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import {
  WForm, WButton, WSelect, WSelectSearch, WDatetimePicker,
} from '@tradesoft/war-ui';

export default {
  name: 'LogsFilters',
  components: {
    WForm,
    WButton,
    WSelect,
    WSelectSearch,
    WDatetimePicker,
  },
  inject: ['messages', 'config'],
  props: {
    filters: {
      type: Object,
      required: true,
    },
    filtersConfig: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localFilters: cloneDeep(this.filters),
    };
  },
  watch: {
    filters(value) {
      this.localFilters = cloneDeep(value);
    },
  },
};
</script>

<style lang="less" scoped>
.logs-filters {
  display: flex;
  align-items: center;
  gap: 24px;

  &__select {
    max-width: 240px;
  }

  &__period {
    display: flex;
    align-items: center;
  }

  &__date-picker {
    min-width: 120px;
  }

  &__button {
    flex-shrink: 0;
  }
}
</style>

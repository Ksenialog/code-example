<template>
  <WForm class="providers-filters" @submit="onFormSubmit">
    <WInput
      v-model.trim="localFilters.title"
      size="sm"
      :placeholder="messages.nameOrLink"
      autoselect-on-focus
      class="mr-2"
      clearable
      @cleared="onFormSubmit"
    >
      <template #append>
        <WLink v-show="!localFilters.title" view="button-icon" color="text" type="submit">
          <WIcon name="button-search-s" />
        </WLink>
      </template>
    </WInput>
  </WForm>
</template>

<script>
import cloneDeep from 'lodash-es/cloneDeep';
import {
  WInput, WLink, WForm, WIcon,
} from '@tradesoft/war-ui';

export default {
  name: 'ProvidersFilters',
  components: {
    WInput,
    WLink,
    WForm,
    WIcon,
  },
  inject: ['messages'],
  props: {
    filters: {
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
    filters() {
      this.localFilters = cloneDeep(this.filters);
    },
  },
  methods: {
    onFormSubmit() {
      this.$emit('change', this.localFilters);
    },
  },
};
</script>

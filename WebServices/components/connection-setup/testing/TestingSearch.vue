<template>
  <WForm class="testing-search" @submit="$emit('search')">
    <WInput
      :value="value"
      :placeholder="messages.detailCode"
      class="testing-search__input"
      @input="$emit('input', $event)"
    >
      <template #append>
        <WLink type="submit" view="button-icon" color="text">
          <WIcon
            width="24"
            height="24"
            name="search-m"
            class="testing-search__input-icon"
          />
        </WLink>
      </template>
    </WInput>

    <div class="testing-search__examples mt-4">
      <p class="wt-control-m m-0 testing-search__examples-text">
        {{ messages.example }}
      </p>

      <WLink
        v-for="link in exampleLinks"
        :key="link"
        view="tooltip"
        class="wt-control-m"
        @click="$emit('search', link)"
      >
        {{ link }}
      </WLink>
    </div>
  </WForm>
</template>

<script>
import {
  WForm, WInput, WLink, WIcon,
} from '@tradesoft/war-ui';

export default {
  name: 'TestingSearch',
  components: {
    WForm, WInput, WLink, WIcon,
  },
  inject: ['messages'],
  props: {
    value: { type: String, required: true },
    exampleLinks: { type: Array, required: true },
  },
};
</script>

<style lang="less" scoped>
.testing-search {
  position: sticky;
  inset-inline-start: 0;
  width: max-content;
  min-width: 408px;
  max-width: 100%;

  &__input {
    max-width: 408px;

    &-icon {
      fill: var(--color-text-tertiary);
    }
  }

  &__examples {
    display: flex;
    gap: 8px;

    &-text {
      color: var(--color-text-tertiary);
    }
  }
}
</style>

<template>
  <div class="providers-group">
    <WCollapse initial-expanded>
      <template #activator="{ toggle, isExpanded }">
        <div class="providers-group__title-wrap">
          <WLink
            view="button-icon"
            color="text"
            hover="default"
            class="wt-h-3"
            @click="onToggleClick(toggle, isExpanded)"
          >
            {{ title }}
            <WIcon
              name="spoiler-down-m"
              width="24"
              height="24"
              class="providers-group__toggle-icon ml-1"
              :class="{ 'providers-group__toggle-icon_collapsed': !isExpanded }"
            />
          </WLink>

          <div class="ml-auto">
            <slot name="after-activator" />
          </div>
        </div>
      </template>

      <RecycleScroller
        :items="providers"
        :item-size="65"
        key-field="name"
        page-mode
        :buffer="130"
      >
        <template #default="{ itemsPool: visibleProviders, sizeBefore, sizeAfter }">
          <WTable
            :rows="visibleProviders"
            :columns="columns"
            sticky-header
            :virtual="expanded && !!providers.length"
            :virtual-size-before="sizeBefore"
            :virtual-size-after="sizeAfter"
            fixed
            class="providers-group__table mt-4"
          >
            <colgroup>
              <col
                v-for="column in columns"
                :key="column.name"
                :style="`width: ${column.width}`"
              >
            </colgroup>

            <template #empty>
              <WEmptyState
                :title="messages.emptyStateTitle"
                :description="messages.emptyStateDescription"
              />
            </template>

            <template #cell()="{ value }">
              <span data-line-clamp="1" :title="value">{{ value }}</span>
            </template>

            <template #cell(status)="{ row: provider }">
              <WIcon
                :name="getStatusIconName(provider.status)"
                width="24"
                height="24"
                class="providers-group__status-icon"
              />
            </template>

            <template #cell(contractRequired)="{ row: provider, value }">
              <div class="providers-group__contract-wrapper">
                {{ value ? messages.required : messages.notRequired }}
                <WIcon
                  v-if="provider.agreementText"
                  v-tooltip="provider.agreementText"
                  name="tooltip-s"
                  height="24"
                  class="providers-group__contract-icon ml-2"
                />
              </div>
            </template>

            <template #cell(orderFeature)="{ row: { orderFeature, orderActive } }">
              <WIcon
                width="24"
                height="24"
                v-bind="getFeatureIconProps(orderFeature, orderActive)"
                class="providers-group__feature-icon"
              />
            </template>

            <template #cell(syncFeature)="{ row: { syncFeature, orderActive } }">
              <WIcon
                width="24"
                height="24"
                v-bind="getFeatureIconProps(syncFeature, orderActive)"
                class="providers-group__feature-icon"
              />
            </template>

            <template #cell(info)="{ row: provider }">
              <WLink
                view="button-icon"
                color="text-tertiary"
                @click="$emit('info-click', provider)"
              >
                <WIcon width="24" height="24" name="info-m" />
              </WLink>
            </template>

            <template #cell(actions)="{ row: provider }">
              <RouterLink v-if="active" custom :to="getProviderRoute(provider)">
                <template #default="{ href, navigate }">
                  <WButton accent="secondary" :href="href" @click="navigate">
                    {{ messages.configure }}
                  </WButton>
                </template>
              </RouterLink>

              <WButton v-else accent="secondary" @click="$emit('connect-click', provider)">
                {{ messages.connect }}
              </WButton>
            </template>
          </WTable>
        </template>
      </RecycleScroller>
    </WCollapse>
  </div>
</template>

<script>
import { VTooltip } from 'v-tooltip';
import {
  WCollapse,
  WIcon,
  WLink,
  WTable,
  WButton,
  WEmptyState,
} from '@tradesoft/war-ui';
import { RecycleScroller } from '@tradesoft/war-vendor/vue-virtual-scroller';
import { PROVIDER_CONNECTIONS } from '../../../const/routeName';
import * as providerStatus from '../../../const/providerStatus';

export default {
  name: 'ProvidersGroup',
  components: {
    WCollapse,
    WIcon,
    WLink,
    WTable,
    WButton,
    WEmptyState,
    RecycleScroller,
  },
  directives: {
    tooltip: VTooltip,
  },
  inject: ['messages'],
  props: {
    title: {
      type: String,
      required: true,
    },
    providers: {
      type: Array,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      expanded: true,
    };
  },
  methods: {
    getStatusIconName(status) {
      switch (status) {
        case providerStatus.OK:
          return 'link-status-all-right-m';
        case providerStatus.NOT_CONFIGURED:
          return 'link-status-non-m';
        case providerStatus.DISABLED:
          return 'link-status-error-m';
        case providerStatus.EXPIRED:
          return 'link-status-warning-m';
        default:
          return null;
      }
    },
    getFeatureIconProps(isSupported, isActive) {
      const name = isSupported ? 'availability-on-m' : 'availability-off-m';
      const color = isActive ? 'var(--color-success)' : 'var(--color-text-disable)';

      return {
        name,
        style: `--color-icon: ${color}`,
      };
    },
    getProviderRoute(provider) {
      return {
        name: PROVIDER_CONNECTIONS,
        params: {
          providerId: provider.name,
        },
      };
    },
    onToggleClick(toggle, prevExpanded) {
      this.expanded = !prevExpanded;
      toggle();
    },
  },
};
</script>

<style lang="less" scoped>
.providers-group {
  max-width: 1000px;

  &__title-wrap {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  &__toggle-icon {
    transition: transform 0.2s ease;
    fill: currentColor;

    &_collapsed {
      transform: rotate(180deg);
    }
  }

  &__table {
    /deep/ .w-table-row_heading {
      top: -40px;
    }
  }

  &__contract-wrapper {
    display: flex;
  }

  &__contract-icon {
    fill: var(--color-bg-primary);
  }

  &__feature-icon {
    fill: var(--color-icon);
  }
}
</style>

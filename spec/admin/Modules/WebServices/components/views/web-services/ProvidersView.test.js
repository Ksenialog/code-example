import { shallowMount } from '@vue/test-utils';
import { WSpinner, WNotice } from '@tradesoft/war-ui';
import { type } from '@tradesoft/war-ui/const/notice';
import Success from '@tradesoft/war-common/ApiManager/result/Success';
import delay from '@tradesoft/war-common/utils/delay';
import ProvidersGroup from 'Admin/Modules/WebServices/components/web-services/providers/ProvidersGroup.vue';
import ProvidersFilters from 'Admin/Modules/WebServices/components/web-services/providers/ProvidersFilters.vue';
import ProviderInfoModal from 'Admin/Modules/WebServices/components/web-services/providers/ProviderInfoModal.vue';
import ProviderConnectModal from 'Admin/Modules/WebServices/components/web-services/providers/ProviderConnectModal.vue';
import ProvidersView from 'Admin/Modules/WebServices/components/views/web-services/ProvidersView.vue';
import Api from 'Admin/Modules/WebServices/api';
import * as providerStatus from 'Admin/Modules/WebServices/const/providerStatus';
import { messages, providerColumns } from '../../../mockData';

const mockGetProviders = (value = []) => {
  jest
    .spyOn(Api.getInstance(), 'getProviders')
    .mockResolvedValue(new Success({
      data: value, meta: { columns: providerColumns },
    }));
};

/** @type {import('@vue/test-utils/types').Wrapper<Vue>} */
let wrapper;

const createComponent = () => {
  wrapper = shallowMount(ProvidersView, {
    attachTo: document.body,
    provide() {
      return {
        messages,
      };
    },
  });
};

const findProvidersGroupByActive = (active = false) => wrapper
  .findAllComponents(ProvidersGroup).wrappers
  .find((w) => w.props().active === active);

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

describe('state loading', () => {
  it('renders spinner when request is in progress', () => {
    mockGetProviders();
    createComponent();
    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBe(true);
  });

  it('does not render spinner when request finished', async () => {
    mockGetProviders();
    createComponent();
    await wrapper.vm.$nextTick();

    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBe(false);
  });
});

describe('empty state', () => {
  it('renders warning notice with empty text when no providers available', async () => {
    mockGetProviders();
    createComponent();
    await wrapper.vm.$nextTick();

    const notice = wrapper.findComponent(WNotice);

    expect(notice.exists()).toBe(true);
    expect(notice.props().type).toBe(type.WARNING);
    expect(notice.text()).toBe(messages.emptyStateTitle);
  });
});

it.each`
    provider | isActive
    ${{ active: false, status: providerStatus.OK }} | ${false}
    ${{ active: false, status: providerStatus.DISABLED }} | ${false}
    ${{ active: false, status: providerStatus.EXPIRED }} | ${false}
    ${{ active: false, status: providerStatus.NOT_CONFIGURED }} | ${false}
    ${{ active: true, status: providerStatus.OK }} | ${true}
    ${{ active: true, status: providerStatus.DISABLED }} | ${true}
    ${{ active: true, status: providerStatus.EXPIRED }} | ${true}
    ${{ active: true, status: providerStatus.NOT_CONFIGURED }} | ${false}
  `('check provider $provider is contained in activeProviders is $isActive', async ({ provider, isActive }) => {
  mockGetProviders([provider]);
  createComponent();
  await wrapper.vm.$nextTick();

  expect(wrapper.vm.activeProviders.includes(provider)).toBe(isActive);
});

it('shows connection modal when emitted connect-click event', async () => {
  const fakeProvider = { active: false, status: providerStatus.OK };
  mockGetProviders([fakeProvider]);
  createComponent();

  await wrapper.vm.$nextTick();
  await wrapper.findComponent(ProvidersGroup).vm.$emit('connect-click', fakeProvider);

  const modal = wrapper.findComponent(ProviderConnectModal);

  expect(modal.exists()).toBe(true);
  expect(modal.props().provider).toBe(fakeProvider);
});

it('shows info modal when emitted info-click event', async () => {
  const fakeProvider = { active: true, status: providerStatus.OK };
  mockGetProviders([fakeProvider]);
  createComponent();

  await wrapper.vm.$nextTick();
  await wrapper.findComponent(ProvidersGroup).vm.$emit('info-click', fakeProvider);
  /* Ожидание резолва промиса асинхронного импорта компонента */
  await delay();

  const modal = wrapper.findComponent(ProviderInfoModal);

  expect(modal.exists()).toBe(true);
  expect(modal.props().provider).toBe(fakeProvider);
});

describe('filters', () => {
  it('renders filters in active providers group', async () => {
    mockGetProviders([{ active: true, status: providerStatus.OK }]);
    createComponent();
    await wrapper.vm.$nextTick();

    const filters = findProvidersGroupByActive(true).findComponent(ProvidersFilters);

    expect(filters.exists()).toBe(true);
    expect(filters.props().filters).toEqual(wrapper.vm.filters);
  });

  it('does not render filters in not active providers group', async () => {
    mockGetProviders([{ active: false, status: providerStatus.OK }]);
    createComponent();
    await wrapper.vm.$nextTick();

    const inactiveProvidersGroup = findProvidersGroupByActive();

    expect(inactiveProvidersGroup.findComponent(ProvidersFilters).exists()).toBe(false);
  });

  it('correctly filters providers by title when filters changed', async () => {
    const fakeFilters = {
      title: 'tes',
    };
    mockGetProviders([
      { active: true, status: providerStatus.OK, title: 'shatest' },
      { active: true, status: providerStatus.OK, title: 'test' },
      { active: true, status: providerStatus.OK, title: 'on Test' },
      { active: true, status: providerStatus.OK, title: 'best' },
    ]);
    createComponent();
    await wrapper.vm.$nextTick();

    const filtersComponent = wrapper.findComponent(ProvidersFilters);
    filtersComponent.vm.$emit('change', fakeFilters);

    expect(wrapper.vm.filteredProviders).toHaveLength(3);
  });
});

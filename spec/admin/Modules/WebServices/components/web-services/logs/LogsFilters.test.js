import { shallowMount } from '@vue/test-utils';
import { WButton, WForm } from '@tradesoft/war-ui';
import LogsFilters from 'Admin/Modules/WebServices/components/web-services/logs/LogsFilters.vue';
import { messages } from '../../../mockData';

/** @type {import('@vue/test-utils/types').Wrapper<Vue>} */
let wrapper;

const fakeAreaItems = [
  { key: 'fakeArea1', value: 'fakeArea1' },
  { key: 'fakeArea2', value: 'fakeArea2' },
];

const fakeProviderItems = [
  { key: 'fakeProvider1', value: 'fakeProvider1' },
  { key: 'fakeProvider2', value: 'fakeProvider2' },
];

const createComponent = ({
  filtersConfig = {
    area: fakeAreaItems,
    provider: fakeProviderItems,
  },
  filters = {
    area: null,
    provider: null,
    dateFrom: null,
    dateTo: null,
  },
} = {}) => {
  wrapper = shallowMount(LogsFilters, {
    attachTo: document.body,
    provide() {
      return {
        messages,
        config: {},
      };
    },
    propsData: {
      filtersConfig,
      filters,
    },
  });
};

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

it('renders form', () => {
  createComponent();

  expect(wrapper.findComponent(WForm).exists()).toBe(true);
});

it('renders submit button', () => {
  createComponent();

  const button = wrapper.findComponent(WButton);

  expect(button.exists()).toBe(true);
  expect(button.attributes().type).toBe('submit');
});

it('emits apply event when form is submitted', () => {
  const fakeAreaValue = fakeAreaItems[0].key;

  createComponent();

  wrapper.setData({
    localFilters: {
      ...wrapper.props().filters,
      area: fakeAreaValue,
    },
  });
  wrapper.findComponent(WForm).vm.$emit('submit');

  expect(wrapper.emitted().apply).toEqual([[expect.objectContaining({ area: fakeAreaValue })]]);
});

import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { WSpinner, WTable, WLink } from '@tradesoft/war-ui';
import { RecycleScroller } from '@tradesoft/war-vendor/vue-virtual-scroller';
import Success from '@tradesoft/war-common/ApiManager/result/Success';
import LogsView from 'Admin/Modules/WebServices/components/views/web-services/LogsView.vue';
import LogsFilters from 'Admin/Modules/WebServices/components/web-services/logs/LogsFilters.vue';
import SummaryInfoLogModal from 'Admin/Modules/WebServices/components/web-services/logs/SummaryInfoLogModal.vue';
import createPaginationStoreModule from 'Admin/Modules/WebServices/store/modules/pagination';
import Api from 'Admin/Modules/WebServices/api';
import { messages, logsColumns } from '../../../mockData';

const localVue = createLocalVue();
localVue.use(Vuex);

const fakeLog = { id: 1 };

let getLogsSpy;

const mockGetLogs = ({
  data = [],
  meta = {
    columnList: logsColumns,
  },
} = {}) => {
  getLogsSpy = jest.spyOn(Api.getInstance(), 'getLogs');
  getLogsSpy.mockResolvedValue(new Success({ data, meta }));
};

/** @type {import('@vue/test-utils/types').Wrapper<Vue>} */
let wrapper;

const createComponent = (state = {}) => {
  const paginationStoreModule = createPaginationStoreModule(state);
  const store = new Vuex.Store({});

  store.registerModule('pagination', paginationStoreModule);

  wrapper = shallowMount(LogsView, {
    attachTo: document.body,
    localVue,
    store,
    provide() {
      return {
        messages,
      };
    },
    stubs: {
      WTable,
      RecycleScroller: {
        ...RecycleScroller,
        render() {
          return this.$scopedSlots.default({
            itemsPool: [fakeLog],
          });
        },
      },
    },
  });
};

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
  getLogsSpy = null;
});

describe('loading state', () => {
  it('renders spinner when request is in progress', async () => {
    mockGetLogs();
    createComponent();

    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(WSpinner).exists()).toBe(true);
  });

  it('does not render spinner when request is finished', async () => {
    mockGetLogs();
    createComponent();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(WSpinner).exists()).toBe(false);
  });
});

describe('filters', () => {
  it('renders LogsFilters when filtersConfig is provided', async () => {
    mockGetLogs({
      meta: {
        columnList: logsColumns,
        filterList: {
          area: [],
          provider: [],
        },
      },
    });
    createComponent();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(LogsFilters).exists()).toBe(true);
  });

  it('add filters to query when filters are applied', async () => {
    const filters = {
      provider: 'fake_provider',
      area: 'sync',
    };

    mockGetLogs({
      meta: {
        columnList: logsColumns,
        filterList: {
          area: [],
          provider: [],
        },
      },
    });
    createComponent();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    wrapper.findComponent(LogsFilters).vm.$emit('apply', filters);

    expect(getLogsSpy).toHaveBeenCalledWith(expect.objectContaining(filters));
  });
});

it('renders table', async () => {
  mockGetLogs();
  createComponent();

  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();

  expect(wrapper.findComponent(WTable).exists()).toBe(true);
});

it('renders SummaryInfoLogModal when summary info button clicked', async () => {
  mockGetLogs({
    data: [fakeLog],
  });
  createComponent();

  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
  wrapper.findComponent(WLink).vm.$emit('click', fakeLog);
  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();

  const summaryInfoLogModal = wrapper.findComponent(SummaryInfoLogModal);

  expect(summaryInfoLogModal.exists()).toBe(true);
  expect(summaryInfoLogModal.props().log).toBe(fakeLog);
});

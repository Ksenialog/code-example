import { shallowMount } from '@vue/test-utils';
import { WModal } from '@tradesoft/war-ui';
import Success from '@tradesoft/war-common/ApiManager/result/Success';
import ProviderInfoModal from 'Admin/Modules/WebServices/components/web-services/providers/ProviderInfoModal.vue';
import ProviderStatisticChart from 'Admin/Modules/WebServices/components/web-services/providers/ProviderStatisticChart.vue';
import Api from 'Admin/Modules/WebServices/api';
import { messages } from '../../../mockData';

const mockGetProviderStatistics = (value = {}) => {
  jest
    .spyOn(Api.getInstance(), 'getProviderStatistics')
    .mockResolvedValue(new Success({ data: value }));
};

const getRegionsString = (regionList) => Object.values(regionList).join(', ');

/** @type {import('@vue/test-utils/types').Wrapper<Vue>} */
let wrapper;

const createComponent = (propsData = {
  provider: {
    name: 'fake-name',
  },
}) => {
  wrapper = shallowMount(ProviderInfoModal, {
    attachTo: document.body,
    provide() {
      return {
        messages,
      };
    },
    propsData,
    stubs: {
      WModal,
    },
  });
};

const findInfoColumns = () => wrapper.findAll('[data-test-id="info-column"]');

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

it('renders modal with provider title', () => {
  const fakeProvider = {
    title: 'fake title',
  };
  mockGetProviderStatistics();
  createComponent({ provider: fakeProvider });

  expect(wrapper.text()).toContain(fakeProvider.title);
});

it('emits close event when WModal is closed', () => {
  mockGetProviderStatistics();
  createComponent();

  const modal = wrapper.findComponent(WModal);
  modal.vm.$emit('close');

  expect(wrapper.emitted('close')).toBeTruthy();
});

describe('info columns', () => {
  it('renders info columns when activeTo and regionList are defined', async () => {
    const fakeProvider = {
      activeTo: 'test',
      regionList: {
        ru: 'Россия',
      },
    };
    mockGetProviderStatistics();
    createComponent({ provider: fakeProvider });
    await wrapper.vm.$nextTick();

    const infoColumns = findInfoColumns();
    const expectedColumnsContents = [
      fakeProvider.activeTo,
      getRegionsString(fakeProvider.regionList),
    ];

    expect(infoColumns).toHaveLength(2);
    infoColumns.wrappers.forEach((w, index) => {
      expect(w.text()).toContain(expectedColumnsContents[index]);
    });
  });

  it('does not render info columns when activeTo and regionList are not defined', async () => {
    mockGetProviderStatistics();
    createComponent();
    await wrapper.vm.$nextTick();

    expect(findInfoColumns()).toHaveLength(0);
  });
});

describe('statistic', () => {
  it('renders ProviderStatisticChart when statistic data are defined', async () => {
    mockGetProviderStatistics({
      latencyData: [{ key: 0, value: 0 }],
      requestCountData: [{ key: 0, value: 0 }],
    });
    createComponent();
    await wrapper.vm.$nextTick();

    expect(wrapper.findAllComponents(ProviderStatisticChart)).toHaveLength(2);
  });

  it('does not render ProviderStatisticChart when statistic data are not defined', async () => {
    mockGetProviderStatistics();
    createComponent();
    await wrapper.vm.$nextTick();

    expect(wrapper.findAllComponents(ProviderStatisticChart)).toHaveLength(0);
  });
});

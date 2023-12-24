import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { WSpinner, WNotice } from '@tradesoft/war-ui';
import { RecycleScroller } from '@tradesoft/war-vendor/vue-virtual-scroller';
import Success from '@tradesoft/war-common/ApiManager/result/Success';
import AnalogsView from 'Admin/Modules/WebServices/components/views/web-services/AnalogsView.vue';
import WebServicesForm from 'Admin/Modules/WebServices/components/WebServicesForm.vue';
import Api from 'Admin/Modules/WebServices/api';
import createTestingStoreModule from 'Admin/Modules/WebServices/store/modules/testing';
import {
  messages,
  fakeFormItems,
  fakeFormData,
  fakePostedFormData,
} from '../../../mockData';

const localVue = createLocalVue();
localVue.use(Vuex);

/** @type {import('@vue/test-utils/types').Wrapper<Vue>} */
let wrapper;

const fakeWebAnalogsConfig = {
  data: fakeFormData,
  meta: {
    isWebAnalogAvailable: true,
    config: fakeFormItems,
  },
};

const mockGetWebAnalogs = (webAnalogsConfig = fakeWebAnalogsConfig) => {
  jest
    .spyOn(Api.getInstance(), 'getWebAnalogs')
    .mockResolvedValue(new Success(webAnalogsConfig));
};

const mockPostWebAnalogs = (formData = fakePostedFormData) => {
  jest
    .spyOn(Api.getInstance(), 'postWebAnalogs')
    .mockResolvedValue(new Success({ data: formData }));
};

const createWrapper = (state = {}) => {
  const testingStoreModule = createTestingStoreModule(state);
  const store = new Vuex.Store({});

  store.registerModule('testing', testingStoreModule);

  wrapper = shallowMount(AnalogsView, {
    localVue,
    store,
    attachTo: document.body,
    provide() {
      return {
        messages,
      };
    },
    stubs: {
      WebServicesForm,
      WSpinner,
      WNotice,
      RecycleScroller,
    },
  });
};

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

describe('visibility WSpinner', () => {
  it('displays WSpinner when requests are being loaded', () => {
    mockGetWebAnalogs();
    createWrapper();

    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBeTruthy();
  });

  it('does not display WSpinner when requests are finished', async () => {
    mockGetWebAnalogs();
    createWrapper();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBeFalsy();
  });

  it('displays WSpinner when post request is being loaded', async () => {
    mockGetWebAnalogs();
    createWrapper();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const webServicesForm = wrapper.findComponent(WebServicesForm);
    await webServicesForm.vm.$emit('submit');
    mockPostWebAnalogs();
    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBeTruthy();
  });

  it('does not display WSpinner when post request is finished', async () => {
    mockGetWebAnalogs();
    createWrapper();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const webServicesForm = wrapper.findComponent(WebServicesForm);
    await webServicesForm.vm.$emit('submit');
    mockPostWebAnalogs();
    await wrapper.vm.$nextTick();
    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBeFalsy();
  });
});

describe('visibility WNotice', () => {
  it('displays WNotice when web-analogs is not available', async () => {
    const mockWebAnalogsConfig = {
      data: {},
      meta: {
        config: [],
        isWebAnalogAvailable: false,
      },
    };
    mockGetWebAnalogs(mockWebAnalogsConfig);
    createWrapper();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const notice = wrapper.findComponent(WNotice);

    expect(notice.text()).toContain(messages.contactTradesoft);
    expect(notice.exists()).toBeTruthy();
  });

  it('does not display WNotice when web-analogs is available', async () => {
    mockGetWebAnalogs();
    createWrapper();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const notice = wrapper.findComponent(WNotice);

    expect(notice.exists()).toBeFalsy();
  });
});

it('displays WebServiceForm after requests were fetched', async () => {
  mockGetWebAnalogs();
  createWrapper();

  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
  const form = wrapper.findComponent(WebServicesForm);

  expect(form.exists()).toBeTruthy();
});

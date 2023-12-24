import { shallowMount } from '@vue/test-utils';
import { WSpinner, WNotice } from '@tradesoft/war-ui';
import Success from '@tradesoft/war-common/ApiManager/result/Success';
import WebInfoView from 'Admin/Modules/WebServices/components/views/web-services/WebInfoView.vue';
import WebServicesForm from 'Admin/Modules/WebServices/components/WebServicesForm.vue';
import Api from 'Admin/Modules/WebServices/api';
import {
  messages,
  fakeFormItems,
  fakeFormData,
  fakePostedFormData,
} from '../../../mockData';

/** @type {import('@vue/test-utils/types').Wrapper<Vue>} */
let wrapper;

const fakeWebInfoConfig = {
  data: fakeFormData,
  meta: {
    isPartInfoAvailable: true,
    config: fakeFormItems,
  },
};

const mockGetWebInfo = (webInfoConfig = fakeWebInfoConfig) => {
  jest
    .spyOn(Api.getInstance(), 'getWebInfo')
    .mockResolvedValue(new Success(webInfoConfig));
};

const mockGetWebInfoLanguages = (data = {}, meta = {}) => {
  jest
    .spyOn(Api.getInstance(), 'getWebInfoLanguages')
    .mockResolvedValue(new Success({ data, meta }));
};

const mockPostWebInfo = (formData = fakePostedFormData) => {
  jest
    .spyOn(Api.getInstance(), 'postWebInfo')
    .mockResolvedValue(new Success({ data: formData }));
};

const createWrapper = () => {
  wrapper = shallowMount(WebInfoView, {
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
    },
  });
};

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

describe('visibility WSpinner', () => {
  it('displays WSpinner when requests are being loaded', () => {
    mockGetWebInfo();
    mockGetWebInfoLanguages();
    createWrapper();

    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBeTruthy();
  });

  it('does not display WSpinner when requests are finished', async () => {
    mockGetWebInfo();
    mockGetWebInfoLanguages();
    createWrapper();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBeFalsy();
  });

  it('displays WSpinner when post request is being loaded', async () => {
    mockGetWebInfo();
    mockGetWebInfoLanguages();
    createWrapper();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const webServicesForm = wrapper.findComponent(WebServicesForm);
    await webServicesForm.vm.$emit('submit');
    mockPostWebInfo();
    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBeTruthy();
  });

  it('does not display WSpinner when post request is finished', async () => {
    mockGetWebInfo();
    mockGetWebInfoLanguages();
    createWrapper();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const webServicesForm = wrapper.findComponent(WebServicesForm);
    await webServicesForm.vm.$emit('submit');
    mockPostWebInfo();
    await wrapper.vm.$nextTick();
    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBeFalsy();
  });
});

describe('visibility WNotice', () => {
  it('displays WNotice when web-info is not available', async () => {
    const mockWebInfoConfig = {
      data: {},
      meta: {
        config: [],
        isPartInfoAvailable: false,
      },
    };
    mockGetWebInfo(mockWebInfoConfig);
    mockGetWebInfoLanguages();
    createWrapper();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const notice = wrapper.findComponent(WNotice);

    expect(notice.text()).toContain(messages.contactTradesoft);
    expect(notice.exists()).toBeTruthy();
  });

  it('does not display WNotice when web-info is available', async () => {
    mockGetWebInfo();
    mockGetWebInfoLanguages();
    createWrapper();

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const notice = wrapper.findComponent(WNotice);

    expect(notice.exists()).toBeFalsy();
  });
});

it('displays WebServiceForm after requests were fetched', async () => {
  mockGetWebInfo();
  mockGetWebInfoLanguages();
  createWrapper();

  await wrapper.vm.$nextTick();
  await wrapper.vm.$nextTick();
  const form = wrapper.findComponent(WebServicesForm);

  expect(form.exists()).toBeTruthy();
});

import { shallowMount } from '@vue/test-utils';
import { WSpinner, WNotice, WTextArea } from '@tradesoft/war-ui';
import Success from '@tradesoft/war-common/ApiManager/result/Success';
import WebOrderView from 'Admin/Modules/WebServices/components/views/web-services/WebOrderView.vue';
import WebOrderTabs from 'Admin/Modules/WebServices/components/web-services/web-order/WebOrderTabs.vue';
import WebServicesForm from 'Admin/Modules/WebServices/components/WebServicesForm.vue';
import WebServicesControl from 'Admin/Modules/WebServices/components/WebServicesControl.vue';
import Api from 'Admin/Modules/WebServices/api';
import {
  messages,
  fakeWebOrderTabs,
  fakeFormItems,
  fakeFormData,
  fakePostedFormData,
} from '../../../mockData';

const defaultWebOrderConfig = {
  data: fakeFormData,
  meta: {
    isWebOrderAvailable: true,
    tabList: fakeWebOrderTabs,
    tabConfig: {
      settings: fakeFormItems,
      syncState: [],
    },
  },
};

const mockGetWebOrder = (value = defaultWebOrderConfig) => {
  jest
    .spyOn(Api.getInstance(), 'getWebOrder')
    .mockResolvedValue(new Success(value));
};

const mockPostWebOrder = (value = fakePostedFormData) => {
  jest
    .spyOn(Api.getInstance(), 'postWebOrder')
    .mockResolvedValue(new Success(value));
};

let wrapper;

const createComponent = () => {
  wrapper = shallowMount(WebOrderView, {
    attachTo: document.body,
    stubs: {
      WebOrderTabs,
      WebServicesForm,
      WSpinner,
      WNotice,
      WTextArea,
      WebServicesControl,
    },
    provide() {
      return {
        messages,
      };
    },
  });
};

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

describe('visibility WNotice', () => {
  it('displays WNotice when web-order is not available', async () => {
    const fakeWebOrderConfig = {
      data: {},
      meta: {
        isWebOrderAvailable: false,
        tabList: fakeWebOrderTabs,
        tabConfig: {
          settings: [],
          syncState: [],
        },
      },
    };
    mockGetWebOrder(fakeWebOrderConfig);
    createComponent();

    await wrapper.vm.$nextTick();
    const notice = wrapper.findComponent(WNotice);

    expect(notice.text()).toContain(messages.contactTradesoft);
    expect(notice.exists()).toBeTruthy();
  });

  it('does not display WNotice when web order is available', async () => {
    mockGetWebOrder();
    createComponent();

    await wrapper.vm.$nextTick();
    const notice = wrapper.findComponent(WNotice);

    expect(notice.exists()).toBeFalsy();
  });
});

describe('shows/ does not show WSpinner', () => {
  it('does not show WSpinner when request is finished', async () => {
    mockGetWebOrder();
    createComponent();

    await wrapper.vm.$nextTick();
    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBeFalsy();
  });

  it('shows WSpinner when request is in progress', () => {
    mockGetWebOrder();
    createComponent();

    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBeTruthy();
  });

  it('shows WSpinner when data is posting', async () => {
    mockGetWebOrder();
    createComponent();

    await wrapper.vm.$nextTick();
    const webServicesForm = wrapper.findComponent(WebServicesForm);
    await webServicesForm.vm.$emit('submit');
    mockPostWebOrder();
    const spinner = wrapper.findComponent(WSpinner);

    expect(spinner.exists()).toBeTruthy();
  });

  it('does not show WSpinner when data was posted', async () => {
    mockGetWebOrder();
    createComponent();

    await wrapper.vm.$nextTick();
    const webServicesForm = wrapper.findComponent(WebServicesForm);
    await webServicesForm.vm.$emit('submit');
    mockPostWebOrder();
    const spinner = wrapper.findComponent(WSpinner);
    await wrapper.vm.$nextTick();

    expect(spinner.exists()).toBeFalsy();
  });
});

it('renders WebServicesForm', async () => {
  mockGetWebOrder();
  createComponent();

  await wrapper.vm.$nextTick();
  const webServicesForm = wrapper.findComponent(WebServicesForm);

  expect(webServicesForm.exists()).toBeTruthy();
});

it('renders WebOrderTabs', async () => {
  mockGetWebOrder();
  createComponent();

  await wrapper.vm.$nextTick();
  const webOrderTabs = wrapper.findComponent(WebOrderTabs);

  expect(webOrderTabs.exists()).toBeTruthy();
});

it('emits change event when formData is not equal defaultFormData', async () => {
  const TEST_TEXT = 'asd asd';
  mockGetWebOrder();
  createComponent();

  await wrapper.vm.$nextTick();
  const textareaField = wrapper.findComponent(WTextArea);
  await textareaField.vm.$emit('input', TEST_TEXT);

  expect(wrapper.emitted().change).toEqual([[true]]);
});

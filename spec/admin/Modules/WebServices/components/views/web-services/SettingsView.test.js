import { shallowMount } from '@vue/test-utils';
import { WSpinner } from '@tradesoft/war-ui';
import Success from '@tradesoft/war-common/ApiManager/result/Success';
import Api from 'Admin/Modules/WebServices/api';
import WebServicesForm from 'Admin/Modules/WebServices/components/WebServicesForm.vue';
import SettingsView from 'Admin/Modules/WebServices/components/views/web-services/SettingsView.vue';
import { messages, fakeFormItems } from '../../../mockData';

let wrapper;

const mockGetSettings = (data = {}, meta = []) => {
  jest
    .spyOn(Api.getInstance(), 'getSettings')
    .mockResolvedValue(new Success({ data, meta }));
};

const mockPostSettings = (value = {}) => {
  jest
    .spyOn(Api.getInstance(), 'postSettings')
    .mockResolvedValue(new Success({ data: value }));
};

const createWrapper = () => {
  wrapper = shallowMount(SettingsView, {
    attachTo: document.body,
    provide() {
      return {
        messages,
      };
    },
    stubs: {
      WebServicesForm,
      WSpinner,
    },
  });
};

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

it('renders title', async () => {
  mockGetSettings();
  createWrapper();

  await wrapper.vm.$nextTick();
  const form = wrapper.findComponent(WebServicesForm);

  expect(form.html()).toContain(messages.settingsTitle);
});

it('does not display WSpinner after fetching data', async () => {
  mockGetSettings();
  createWrapper();

  await wrapper.vm.$nextTick();
  const spinner = wrapper.findComponent(WSpinner);

  expect(spinner.exists()).toBeFalsy();
});

it('displays WSpinner when it is fetching data', () => {
  mockGetSettings();
  createWrapper();

  const spinner = wrapper.findComponent(WSpinner);

  expect(spinner.exists()).toBeTruthy();
});

it('displays WSpinner when it posts data', async () => {
  mockGetSettings({}, fakeFormItems);
  createWrapper();

  await wrapper.vm.$nextTick();
  const form = wrapper.findComponent(WebServicesForm);
  await form.vm.$emit('submit');
  mockPostSettings();
  const spinner = wrapper.findComponent(WSpinner);

  expect(spinner.exists()).toBeTruthy();
});

it('does not display WSpinner after posting data', async () => {
  mockGetSettings({}, fakeFormItems);
  createWrapper();

  await wrapper.vm.$nextTick();
  const form = wrapper.findComponent(WebServicesForm);
  await form.vm.$emit('submit');
  mockPostSettings();
  await wrapper.vm.$nextTick();
  const spinner = wrapper.findComponent(WSpinner);

  expect(spinner.exists()).toBeFalsy();
});

it('renders WebServicesForm after loading data', async () => {
  mockGetSettings();
  createWrapper();

  await wrapper.vm.$nextTick();
  const form = wrapper.findComponent(WebServicesForm);

  expect(form.exists()).toBeTruthy();
});

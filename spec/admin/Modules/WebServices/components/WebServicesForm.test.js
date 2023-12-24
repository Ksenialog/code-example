import { shallowMount } from '@vue/test-utils';
import { WForm } from '@tradesoft/war-ui';
import WebServicesForm from 'Admin/Modules/WebServices/components/WebServicesForm.vue';
import WebServicesSwitch from 'Admin/Modules/WebServices/components/WebServicesSwitch.vue';
import WebServicesFormGroup from 'Admin/Modules/WebServices/components/WebServicesFormGroup.vue';
import WebServicesFormTitle from 'Admin/Modules/WebServices/components/WebServicesFormTitle.vue';
import WebServicesControl from 'Admin/Modules/WebServices/components/WebServicesControl.vue';
import { fakeFormItems, fakeFormData, messages } from '../mockData';

let wrapper;

const FAKE_TITLE = 'test title';
const FAKE_FORM_ID = 'web-order';

const createWrapper = (propsData = {
  title: FAKE_TITLE,
  formId: FAKE_FORM_ID,
  items: fakeFormItems,
  formData: fakeFormData,
}) => {
  wrapper = shallowMount(WebServicesForm, {
    propsData,
    provide() {
      return {
        messages,
      };
    },
    stubs: {
      WForm,
      WebServicesSwitch,
      WebServicesFormGroup,
      WebServicesFormTitle,
      WebServicesControl,
    },
  });
};

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

it('shows title', () => {
  createWrapper();

  expect(wrapper.text()).toContain(FAKE_TITLE);
});

it('has formId in WForm', () => {
  createWrapper();

  const form = wrapper.findComponent(WForm);

  expect(wrapper.props().formId).toContain(FAKE_FORM_ID);
  expect(form.attributes().id).toBe(FAKE_FORM_ID);
});

it('emits submit correctly', async () => {
  createWrapper();

  await wrapper.findComponent(WForm).vm.$emit('submit');

  expect(wrapper.emitted().submit).toHaveLength(1);
});

it('emits change event when control changed', async () => {
  const FAKE_VALUE = '2222';
  const fakeName = fakeFormItems[0].controls[0].name;
  createWrapper();

  const control = wrapper.findComponent(WebServicesControl);
  await control.vm.$emit('change', FAKE_VALUE);

  expect(wrapper.emitted().change).toEqual([[FAKE_VALUE, fakeName]]);
});

it('displays WebServicesFormGroup', () => {
  createWrapper();

  const webServicesSwitch = wrapper.findComponent(WebServicesFormGroup);

  expect(webServicesSwitch.exists()).toBe(true);
});

it('displays WebServicesSwitch', () => {
  createWrapper();

  const webServicesSwitch = wrapper.findComponent(WebServicesSwitch);

  expect(webServicesSwitch.exists()).toBe(true);
});

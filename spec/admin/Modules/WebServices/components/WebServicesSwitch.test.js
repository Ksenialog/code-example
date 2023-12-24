import { mount } from '@vue/test-utils';
import WebServicesSwitch from 'Admin/Modules/WebServices/components/WebServicesSwitch.vue';
import WebServicesControl from 'Admin/Modules/WebServices/components/WebServicesControl.vue';
import { messages } from '../mockData';

let wrapper;

const FAKE_LABEL = 'webServiceSwitch label';
const FAKE_SUB_LABEL = 'webServiceSwitch sub label';

const createWrapper = (propsData = {
  label: FAKE_LABEL,
  subLabel: FAKE_SUB_LABEL,
}) => {
  wrapper = mount(WebServicesSwitch, {
    propsData,
    stubs: {
      WebServicesControl,
    },
    slots: {
      controls: '<WebServicesControl :value="1" :control="{}" />',
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

it('renders label', () => {
  createWrapper();

  expect(wrapper.text()).toContain(FAKE_LABEL);
});

it('renders subLabel', () => {
  createWrapper();

  expect(wrapper.text()).toContain(FAKE_SUB_LABEL);
});

it('contains controls in slot named controls', () => {
  createWrapper();

  const control = wrapper.findComponent(WebServicesControl);

  expect(control.exists()).toBeTruthy();
});

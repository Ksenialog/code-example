import { shallowMount } from '@vue/test-utils';
import {
  WTooltip,
  WIcon,
  WFormGroup,
} from '@tradesoft/war-ui';
import WebServicesFormGroup from 'Admin/Modules/WebServices/components/WebServicesFormGroup.vue';
import WebServicesControl from 'Admin/Modules/WebServices/components/WebServicesControl.vue';
import { messages } from '../mockData';

let wrapper;

const FAKE_LABEL = 'fake label';
const FAKE_SUB_LABEL = 'fake subLabel';

const createComponent = (propsData = {
  label: FAKE_LABEL,
  subLabel: FAKE_SUB_LABEL,
}) => {
  wrapper = shallowMount(WebServicesFormGroup, {
    propsData,
    attachTo: document.body,
    stubs: {
      WFormGroup,
      WTooltip,
      WIcon,
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

it('contains label', () => {
  createComponent();

  expect(wrapper.text()).toContain(FAKE_LABEL);
});

it('contains subLabel', () => {
  createComponent();

  expect(wrapper.text()).toContain(FAKE_SUB_LABEL);
});

it('contains controls in slot named controls', () => {
  createComponent();

  const control = wrapper.findComponent(WebServicesControl);

  expect(control.exists()).toBeTruthy();
});

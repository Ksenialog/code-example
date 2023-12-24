import { shallowMount } from '@vue/test-utils';
import {
  WInput,
  WCheckbox,
  WSelect,
  WSelectSearch,
  WTextArea,
  WTokenList,
  WRadioGroup,
  WSwitch,
} from '@tradesoft/war-ui';
import WebServicesControl from 'Admin/Modules/WebServices/components/WebServicesControl.vue';
import WebServicesStateSelect from 'Admin/Modules/WebServices/components/WebServicesStateSelect.vue';
import { messages } from '../mockData';

const fakeControl = {
  WInput: {
    templateId: 'WInput',
    name: 'input',
  },
  WCheckbox: {
    templateId: 'WCheckbox',
    name: 'checkbox',
  },
  WSelect: {
    templateId: 'WSelect',
    name: 'select',
    items: [],
    objectMode: true,
  },
  WSelectSearch: {
    templateId: 'WSelectSearch',
    name: 'select',
    items: [],
    objectMode: true,
  },
  WTextArea: {
    templateId: 'WTextArea',
    name: 'textarea',
  },
  WTokenList: {
    templateId: 'WTokenList',
    name: 'tokenList',
    items: [],
  },
  WRadioGroup: {
    templateId: 'WRadioGroup',
    name: 'radioGroup',
    items: [],
    textKey: 'value',
    valueKey: 'key',
  },
  WSwitch: {
    templateId: 'WSwitch',
    name: 'switch',
  },
  WebServicesStateSelect: {
    templateId: 'WebServicesStateSelect',
    name: 'state',
    items: [],
  },
};

const fakeControlValue = {
  WInput: '',
  WCheckbox: true,
  WSelect: 'testKey',
  WSelectSearch: 'search',
  WTextArea: '',
  WTokenList: [],
  WRadioGroup: 1,
  WSwitch: true,
  WebServicesStateSelect: 0,
};

let wrapper;

const createComponent = (propsData) => {
  wrapper = shallowMount(WebServicesControl, {
    propsData,
    stubs: {
      WInput,
      WCheckbox,
      WSelect,
      WSelectSearch,
      WTextArea,
      WTokenList,
      WRadioGroup,
      WSwitch,
      WebServicesStateSelect,
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

it.each([
  ['WInput', WInput, 'test', 'input'],
  ['WCheckbox', WCheckbox, false, 'change'],
  ['WSelect', WSelect, 'asd', 'change'],
  ['WTextArea', WTextArea, 'test 2', 'input'],
  ['WTokenList', WTokenList, [1, 19, 3], 'change'],
  ['WRadioGroup', WRadioGroup, 'qwerty', 'change'],
  ['WSwitch', WSwitch, 'false', 'change'],
  ['WSelectSearch', WSelectSearch, 'test', 'change'],
  ['WebServicesStateSelect', WebServicesStateSelect, 1, 'change'],
])('should emit change event after change %s component', async (componentName, component, componentNewValue, emitName) => {
  createComponent({
    control: fakeControl[componentName],
    value: fakeControlValue[componentName],
  });

  await wrapper.findComponent(component).vm.$emit(emitName, componentNewValue);

  expect(wrapper.emitted().change).toEqual([[componentNewValue]]);
});

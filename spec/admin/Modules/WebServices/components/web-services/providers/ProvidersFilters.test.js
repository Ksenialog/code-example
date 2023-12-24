import { shallowMount } from '@vue/test-utils';
import {
  WInput, WLink, WForm, WFormField,
} from '@tradesoft/war-ui';
import ProvidersFilters from 'Admin/Modules/WebServices/components/web-services/providers/ProvidersFilters.vue';
import { messages } from '../../../mockData';

/** @type {import('@vue/test-utils/types').Wrapper<Vue>} */
let wrapper;

const createComponent = (filters) => {
  wrapper = shallowMount(ProvidersFilters, {
    provide() {
      return {
        messages,
      };
    },
    propsData: {
      filters,
    },
    stubs: {
      WLink,
      WInput,
      WForm,
      WFormField,
    },
    attachTo: document.body,
  });
};

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

it('renders filter title input', () => {
  createComponent({ title: '' });

  expect(wrapper.find('input').exists()).toBe(true);
});

it('should emits change event when filters form submitted', async () => {
  const fakeTitleValue = 'Fake title';
  createComponent({ title: '' });

  await wrapper.find('input').setValue(fakeTitleValue);
  await wrapper.find('[type="submit"]').trigger('click');

  expect(wrapper.emitted().change).toEqual([[{
    title: fakeTitleValue,
  }]]);
});

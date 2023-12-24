import { mount } from '@vue/test-utils';
import WebOrderTabs from 'Admin/Modules/WebServices/components/web-services/web-order/WebOrderTabs.vue';
import { fakeWebOrderTabs } from '../../../mockData';

let wrapper;

const createComponent = () => {
  wrapper = mount(WebOrderTabs, {
    propsData: {
      tabs: fakeWebOrderTabs,
      active: 'settings',
    },
  });
};

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

it('renders titles', () => {
  createComponent();

  fakeWebOrderTabs.forEach((tab) => {
    expect(wrapper.text()).toContain(tab.title);
  });
});

it('has only one active tab', () => {
  const activeClass = 'active';
  createComponent();

  const tabs = wrapper.findAll(`button[class*="${activeClass}"]`);

  expect(tabs).toHaveLength(1);
});

it('generates an event with the name of the clicked tab when the tab is clicked', async () => {
  const TAB_INDEX = 1;
  createComponent();

  await wrapper.findAll('button').at(TAB_INDEX).trigger('click');

  expect(wrapper.emitted().change).toEqual([[fakeWebOrderTabs[TAB_INDEX].name]]);
});

import { mount } from '@vue/test-utils';
import WebServicesFormTitle from 'Admin/Modules/WebServices/components/WebServicesFormTitle.vue';

let wrapper;

const FAKE_LABEL = 'webServicesFormTitle label';

const createWrapper = (propsData = {
  label: FAKE_LABEL,
}) => {
  wrapper = mount(WebServicesFormTitle, {
    propsData,
  });
};

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

it('renders title', () => {
  createWrapper();

  expect(wrapper.text()).toContain(FAKE_LABEL);
});

import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import {
  WCollapse, WTable, WLink, WIcon, WButton,
} from '@tradesoft/war-ui';
import ProvidersGroup from 'Admin/Modules/WebServices/components/web-services/providers/ProvidersGroup.vue';
import * as providerStatus from 'Admin/Modules/WebServices/const/providerStatus';
import { messages, providerColumns } from '../../../mockData';

/** @type {import('@vue/test-utils/types').Wrapper<Vue>} */
let wrapper;

const ACTIVE_PROVIDERS = [
  { active: true, status: providerStatus.OK },
  { active: true, status: providerStatus.DISABLED },
  { active: true, status: providerStatus.EXPIRED },
  { active: true, status: providerStatus.OK },
];

const findFirstConnectionButton = () => wrapper
  .findAll('button').wrappers
  .find((w) => w.text().includes(messages.connect));

const createComponent = ({
  title = messages.connected,
  providers = ACTIVE_PROVIDERS,
  active = true,
} = {}) => {
  wrapper = shallowMount(ProvidersGroup, {
    attachTo: document.body,
    /*
      Можно использовать mount вместо shallowMount без указания stubs,
      но падает ошибка https://github.com/jestjs/jest/issues/13976
      */
    stubs: {
      WButton,
      WLink,
      WCollapse,
      WTable,
      RouterLink: {
        ...RouterLinkStub,
        render() {
          const children = this.$scopedSlots.default({
            href: '/foo',
            isActive: false,
            navigate: jest.fn(),
          });
          return children;
        },
      },
      RecycleScroller: {
        render() {
          return this.$scopedSlots.default({
            itemsPool: providers,
          });
        },
      },
    },
    provide() {
      return {
        messages,
      };
    },
    propsData: {
      title,
      providers,
      active,
      columns: providerColumns,
    },
  });
};

afterEach(() => {
  wrapper?.destroy();
  wrapper = null;
});

describe('collapse', () => {
  it('renders initially expanded collapse component', () => {
    createComponent();
    const collapse = wrapper.findComponent(WCollapse);

    expect(collapse.exists()).toBe(true);
    expect(collapse.props().initialExpanded).toBe(true);
  });

  it('renders button with group title', () => {
    const title = messages.notConnected;
    createComponent({ title });

    const buttonWithTitle = wrapper
      .findAllComponents(WLink).wrappers
      .find((w) => w.text().includes(title));

    expect(buttonWithTitle.exists()).toBe(true);
  });
});

describe('table', () => {
  it('should emits info-click event when info button is clicked', async () => {
    const [firstProvider] = ACTIVE_PROVIDERS;
    createComponent();

    await wrapper.vm.$nextTick();

    const firstInfoButton = wrapper
      .findAllComponents(WLink).wrappers
      .find(
        (w) => w.findComponent(WIcon)?.props().name === 'info-m',
      );
    await firstInfoButton.trigger('click');

    expect(wrapper.emitted('info-click')).toEqual([[firstProvider]]);
  });

  it('renders link to provider connections page if group is active', async () => {
    createComponent();

    await wrapper.vm.$nextTick();

    const firstConfigureLink = wrapper
      .findAll('a[href]').wrappers
      .find((w) => w.text().includes(messages.configure));

    expect(firstConfigureLink.exists()).toBe(true);
  });

  describe('group is not active', () => {
    const inactiveProviders = [
      { active: false, status: providerStatus.EXPIRED },
    ];

    beforeEach(() => {
      createComponent({
        providers: inactiveProviders,
        active: false,
      });
    });

    it('renders connection button if group is not active', () => {
      const connectionButton = findFirstConnectionButton();

      expect(connectionButton.exists()).toBe(true);
    });

    it('should emits connect-click event when connection button is clicked', async () => {
      const [firstInactiveProvider] = inactiveProviders;
      await findFirstConnectionButton().trigger('click');

      expect(wrapper.emitted('connect-click')).toEqual([[firstInactiveProvider]]);
    });
  });
});

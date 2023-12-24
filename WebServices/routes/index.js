import * as routeName from '../const/routeName';

/**
 * @returns {import('vue-router').RouteConfig[]}
 */
export default function getRoutes() {
  return [
    {
      path: '/',
      component: () => import(
        /* webpackChunkName: "WebServicesPage" */
        '../components/pages/WebServicesPage.vue'
      ),
      children: [
        {
          name: routeName.WEBSERVICES_PROVIDERS,
          path: 'providers',
          component: () => import(
            /* webpackChunkName: "ProvidersView" */
            '../components/views/web-services/ProvidersView.vue'
          ),
        },
        {
          name: routeName.WEBSERVICES_WEB_ORDER,
          path: 'web-order',
          component: () => import(
            /* webpackChunkName: "WebOrderView" */
            '../components/views/web-services/WebOrderView.vue'
          ),
          meta: {
            editable: true,
          },
        },
        {
          name: routeName.WEBSERVICES_ANALOGS,
          path: 'analogs',
          component: () => import(
            /* webpackChunkName: "AnalogsView" */
            '../components/views/web-services/AnalogsView.vue'
          ),
          meta: {
            editable: true,
            testable: true,
          },
        },
        {
          name: routeName.WEBSERVICES_WEB_INFO,
          path: 'web-info',
          component: () => import(
            /* webpackChunkName: "WebInfoView" */
            '../components/views/web-services/WebInfoView.vue'
          ),
          meta: {
            editable: true,
          },
        },
        {
          name: routeName.WEBSERVICES_LOGS,
          path: 'logs',
          component: () => import(
            /* webpackChunkName: "LogsView" */
            '../components/views/web-services/LogsView.vue'
          ),
          meta: {
            paginatable: true,
          },
        },
        {
          name: routeName.WEBSERVICES_SETTINGS,
          path: 'settings',
          component: () => import(
            /* webpackChunkName: "SettingsView" */
            '../components/views/web-services/SettingsView.vue'
          ),
          meta: {
            editable: true,
          },
        },
        {
          path: '',
          name: routeName.WEBSERVICES,
          redirect: {
            name: routeName.WEBSERVICES_PROVIDERS,
          },
        },
      ],
    },
    {
      name: routeName.PROVIDER_CONNECTIONS,
      path: '/providers/:providerId/connections',
      component: () => import(
        /* webpackChunkName: "ProviderConnectionsPage" */
        '../components/pages/ProviderConnectionsPage.vue'
      ),
      meta: {
        breadcrumbs: [{
          to: { name: routeName.WEBSERVICES_PROVIDERS },
          titleKey: 'providers',
        }],
      },
    },
    {
      path: '/providers/:providerId/connections/:connectionId',
      component: () => import(
        /* webpackChunkName: "ConnectionSetupPage" */
        '../components/pages/ConnectionSetupPage.vue'
      ),
      meta: {
        breadcrumbs: [{
          to: { name: routeName.WEBSERVICES_PROVIDERS },
          titleKey: 'providers',
        }, {
          to: { name: routeName.PROVIDER_CONNECTIONS },
          titleKey: 'providerConnections',
        }],
      },
      children: [
        {
          name: routeName.CONNECTION_SETUP_ACCOUNT,
          path: 'account',
          component: () => import(
            /* webpackChunkName: "AccountView" */
            '../components/views/connection-setup/AccountView.vue'
          ),
          meta: {
            editable: true,
          },
        },
        {
          name: routeName.CONNECTION_SETUP_SETUP,
          path: 'setup',
          component: () => import(
            /* webpackChunkName: "SetupView" */
            '../components/views/connection-setup/SetupView.vue'
          ),
          meta: {
            editable: true,
          },
        },
        {
          name: routeName.CONNECTION_SETUP_TESTING,
          path: 'testing',
          component: () => import(
            /* webpackChunkName: "TestingView" */
            '../components/views/connection-setup/TestingView.vue'
          ),
          meta: {
            showingTime: true,
          },
        },
        {
          name: routeName.CONNECTION_SETUP_FILTERING,
          path: 'filtering',
          component: () => import(
            /* webpackChunkName: "FilteringView" */
            '../components/views/connection-setup/FilteringView.vue'
          ),
          meta: {
            editable: true,
          },
        },
        {
          name: routeName.CONNECTION_SETUP_MARKETING,
          path: 'marketing',
          component: () => import(
            /* webpackChunkName: "MarketingView" */
            '../components/views/connection-setup/MarketingView.vue'
          ),
          meta: {
            editable: true,
          },
        },
        {
          name: routeName.CONNECTION_SETUP_STATE_MAPPING,
          path: 'state-mapping',
          component: () => import(
            /* webpackChunkName: "StateMappingView" */
            '../components/views/connection-setup/StateMappingView.vue'
          ),
          meta: {
            editable: true,
          },
        },
        {
          name: routeName.CONNECTION_SETUP_DELIVERY_SCHEDULE,
          path: 'delivery-schedule',
          component: () => import(
            /* webpackChunkName: "DeliverySchedule" */
            '../components/views/connection-setup/DeliveryScheduleView.vue'
          ),
          meta: {
            editable: true,
          },
        },
        {
          path: '',
          name: routeName.CONNECTION_SETUP,
          redirect: routeName.CONNECTION_SETUP_ACCOUNT,
        },
      ],
    },
  ];
}

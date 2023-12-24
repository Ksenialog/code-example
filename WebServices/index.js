import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './WebServicesApp.vue';
import getRoutes from './routes';

Vue.use(VueRouter);
Vue.use(Vuex);
const ExtendedApp = Vue.extend(App);

const defaultOptions = {
  containerId: 'web-services',
};

export default class WebServices {
  constructor(options) {
    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.init();
  }

  init() {
    const { containerId } = this.options;

    const el = document.getElementById(containerId);
    if (!el) {
      console.error(`Element with id ${containerId} not found`);
      return;
    }

    const router = new VueRouter({
      routes: getRoutes(),
    });

    const store = new Vuex.Store({});

    this.app = new ExtendedApp({
      el,
      propsData: { ...this.options },
      store,
      router,
    });
  }
}

window.WebServices = WebServices;

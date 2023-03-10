import Vue from 'vue';
import Vuex from 'vuex';

import form from './modules/form.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    form
  }
});

export default store;
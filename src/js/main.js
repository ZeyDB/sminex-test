import Vue from 'vue';
import feedback from '../components/feedback.vue'
import store from './store';
import VueMask from 'v-mask'
import Vuelidate from 'vuelidate';

Vue.use(VueMask);
Vue.use(Vuelidate);

new Vue({
  store,
  render: h => h(feedback),
}).$mount('#app')
import Vue from 'vue';
import VueCookie from 'vue-cookie';
import App from './App';
import router from './router/index';
import store from './store/index';

// setup font awesome and icons used
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faUserCircle, 
  faBell, 
  faCog, 
  faSignOutAlt, 
  faTrashAlt, 
  faHeart, 
  faRetweet,
  faEdit,
  faTimes,
  faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserCircle, faBell, faCog, faSignOutAlt, faTrashAlt, faHeart, faRetweet, faEdit, faTimes, faExclamationTriangle)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueCookie);

Vue.config.productionTip = false;

// initialize event bus
export const eventBus = new Vue();



new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

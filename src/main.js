import Vue from 'vue';
import App from './App';
import router from './router/index';
import store from './store/index';

// setup font awesome and icons used
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUserCircle, 
  faBell, 
  faCog, 
  faSignOutAlt, 
  faTrashAlt, 
  faHeart as sHeart, 
  faRetweet,
  faEdit,
  faTimes,
  faExclamationTriangle,
  faSearch, 
  faUserLock,
  faUserFriends,
  faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faSmile, faHeart as rHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserCircle, faBell, faCog, faSignOutAlt, faTrashAlt, sHeart, rHeart, faRetweet, faEdit, faTimes, faExclamationTriangle, faSearch, faUserLock, faUserPlus, faSmile, faUserFriends)
Vue.component('font-awesome-icon', FontAwesomeIcon)


Vue.config.productionTip = false;

// initialize event bus
export const eventBus = new Vue();



new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});


/* eslint-disable no-unused-vars */
import Vue from 'vue';
import VueRouter from 'vue-router'
import cookie from "vue-cookie";

import store from '../store/index';
import Home from '../views/Home';
import Register from '../views/Register';
import Login from '../views/Login';
import Profile from '../views/Profile';
import NotFound from '../views/NotFound';
import Notifications from '../views/Notifications';
import Settings from '../views/Settings';


Vue.use(VueRouter);


const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/', 
      name: "Home",
      component: Home, 
      props: true,
      meta: {
        title: route => {
          return "Home - Fritter";
        }
      }
    },

    {
      path: '/register', 
      name: 'Register',
      component: Register, 
      props: true,
      meta: {
        title: route => {
          return "Register - Fritter";
        },
        requiresAuth: false
      },
    },

    {
      path: '/login', 
      name: 'Login',
      component: Login, 
      props: true,
      meta: {
        title: route => {
          return "Login - Fritter";
        },
        requiresAuth: false
      },
    },

    {
      path: '/home', 
      redirect: '/'
    },

    {
      path: '/notifications', 
      name: 'Notifications',
      component: Notifications, 
      props: true,
      meta: {
        title: route => {
          return "Notifications - Fritter";
        },
        requiresAuth: true
      }
    },

    {
      path: '/settings', 
      name: 'Settings',
      component: Settings, 
      props: true,
      meta: {
        title: route => {
          return "Settings - Fritter";
        },
        requiresAuth: true
      }
    },

    {
      path: '/:author', 
      name: 'Profile',
      component: Profile, 
      props: true,
      meta: { 
        title: route => {
          return `${route.params.author} - Fritter`;
        }
      }
    },

    {
      path: '/:author/freets', 
      redirect: '/:author'
    },

    {
      path: '*', 
      component: NotFound, 
      props: true,
      meta: {
        title: route => {
          return "NotFound - Fritter";
        } 
      }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  // before navigating to the any page, this ensure that the user object is up to date. 
  await store.dispatch("getUser");

  if (to.meta.requiresAuth !== undefined) { 
    if (to.meta.requiresAuth) {
      if (!cookie.get("fritter-auth")) {
        next({ name: "Login" })

      } else {
        document.title = to.meta.title(to);
        next();
      }

    } else {
      if (cookie.get("fritter-auth")) {
        next({ name: "Home" })

      } else {
        document.title = to.meta.title(to);
        next();
      }
    }
  } else {
    document.title = to.meta.title(to);
    next();
  }
});


export default router;
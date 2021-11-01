import Vue from "vue";
import cookie from "vue-cookie";
import Vuex from "vuex";
import { get } from '../utils/crud-helpers';


Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    user: null,
  },

  mutations: {
    // synchronous information

    setUser(state, payload) {
      if (payload !== null) {
        cookie.set("fritter-auth", payload.userId);
      } else {
        cookie.delete("fritter-auth");
      }
      state.user = payload;
    }
  },

  actions: {
    // asynchorous information

    async getUser(state) {
      const response = await get('/api/user/session');
      if (response.isSuccess) {
        state.commit("setUser", response.data.user);
      } else {
        // this request is not expected to get any errors from the server
      }
    },

    updateUser(state, payload) {
      state.commit("setUser", payload);
    },

    authenticateUser(state, payload) {
      state.commit("setUser", payload);
    },

    unauthenticateUser(state) {
      state.commit("setUser", null);
    }
  },

  getters: {
    user: state => state.user,
    isSignedIn: state => state.user !== null,
    isPrivateAccount: state => state.user !== null && state.user.isPrivateAccount,
  }
});

export default store;
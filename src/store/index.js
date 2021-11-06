import Vue from "vue";
import Vuex from "vuex";
import { get } from '../utils/crud-helpers';


Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    user: null,
    suggestions: [],
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },

    setSuggestions(state, payload) {
      state.suggestions = payload;
    }
  },

  actions: {
    async getUser(state) {
      const response = await get('/api/user/session');
      if (response.isSuccess) {
        state.commit("setUser", response.data.user);
        state.commit("setSuggestions", response.data.suggestions);

      } else {
        // this request is not expected to get any errors from the server
      }
    },

    updateUser(state, payload) {
      state.commit("setUser", payload);
    }
  },

  getters: {
    user: state => state.user,
    suggestions: state => state.suggestions,
    isSignedIn: state => state.user !== null,
    isPrivateAccount: state => state.user !== null && state.user.isPrivateAccount,
  }
});

export default store;
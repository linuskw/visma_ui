import Vue from 'vue';
import Vuex from 'vuex';
import VueJwtDecode from 'vue-jwt-decode';
import { snackbar } from './snackbar';

const axios = require('axios').default;

Vue.use(Vuex);

const initialState = {
  authenticate: {},
  secret: {},
  wiki: {},
  users: {},
  selected_item: {},
};

const getters = {
  user_token: (state) => {
    return state.authenticate.token
      ? VueJwtDecode.decode(state.authenticate.token)
      : undefined;
  },
  selected_item: (state) => state.selected_item,
};

const mutations = {
  mutate(state, { property, with: value }) {
    state[property] = value;
  },
  add_item(state, { type, data }) {
    if (!state[type]._items) {
      state[type]._items = [];
    }
    state[type]._items.push(data);
  },
  remove_item(state, { type, doc_id }) {
    state[type]._items = state[type]._items.filter((doc) => doc._id !== doc_id);
  },
  set_selected_item(state, item) {
    state.selected_item = item;
  },
};

const getToken = () => {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
};

const createAxiosInstance = () => {
  return axios.create({
    baseURL: process.env.VUE_APP_API_ROOT,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
  });
};

const actions = {
  async api_get({ commit, dispatch }, payload) {
    try {
      const response = await createAxiosInstance().get(payload.url, {
        headers: { token: getToken() },
        params: payload.params,
      });
      if (payload.commit) {
        commit('mutate', {
          property: payload.state_property,
          with: response.data,
        });
      }
      return response;
    } catch (error) {
      console.error('API GET error:', error.response.data._error);
      dispatch(
        'snackbar/show_snackbar',
        {
          text:
            error.response.data._error.message.message || 'An error occurred',
          color: 'error',
        },
        { root: true },
      );
      throw error;
    }
  },
  async api_get_single_item({ commit, dispatch }, payload) {
    try {
      const response = await createAxiosInstance().get(payload.url, {
        headers: { token: getToken() },
        params: payload.params,
      });
      if (payload.commit) {
        commit('set_selected_item', response.data);
      }
      return response;
    } catch (error) {
      console.error('API GET error:', error.response);
      dispatch(
        'snackbar/show_snackbar',
        {
          text:
            error.response.data._error.message.message || 'An error occurred',
          color: 'error',
        },
        { root: true },
      );
      throw error;
    }
  },
  async api_post({ commit, dispatch }, payload) {
    try {
      const response = await createAxiosInstance().post(
        payload.url,
        payload.data,
        {
          headers: { token: getToken() },
        },
      );
      if (payload.commit) {
        const new_object = Object.assign({}, response.data, payload.data);
        commit('add_item', {
          type: payload.state_property,
          data: new_object,
        });
      }
      return response;
    } catch (error) {
      console.error('API POST error:', error.response);
      dispatch(
        'snackbar/show_snackbar',
        {
          text:
            error.response.data._error.message.message || 'An error occurred',
          color: 'error',
        },
        { root: true },
      );
      throw error;
    }
  },
  async api_patch({dispatch}, payload) {
    try {
      let data = JSON.parse(JSON.stringify(payload.data));
      delete data._id;
      delete data._etag;
      delete data._created;
      delete data._updated;

      return await axios.patch(
        process.env.VUE_APP_API_ROOT + payload.url,
        data,
        {
          headers: {
            token: getToken(),
            'Cache-Control': 'no-cache',
            'If-Match': payload.etag,
          },
        },
      );
    } catch (error) {
      console.error('API PATCH error:', error.response);
      dispatch(
        'snackbar/show_snackbar',
        {
          text:
            error.response.data._error.message.message || 'An error occurred',
          color: 'error',
        },
        { root: true },
      );
      throw error;
    }
  },
  async api_delete({ dispatch }, payload) {
    try {
      await axios.delete(process.env.VUE_APP_API_ROOT + payload.url, {
        headers: {
          token: getToken(),
          'Cache-Control': 'no-cache',
          'If-Match': payload.etag,
        },
      });
    } catch (error) {
      console.error('API DELETE error:', error.response);
      dispatch(
        'snackbar/show_snackbar',
        {
          text:
            error.response.data._error.message.message || 'An error occurred',
          color: 'error',
        },
        { root: true },
      );
      throw error;
    }
  },
  set_state_property({ commit }, payload) {
    commit('mutate', {
      property: payload.state_property,
      with: payload.data,
    });
  },
  reset_state({ commit, dispatch }, payload) {
    const state_properties = payload
      ? payload.state_properties
      : Object.keys(this.state);
    state_properties.forEach((property) => {
      commit('mutate', {
        property,
        with: Array.isArray(this.state[property]) ? [] : {},
      });
    });
    dispatch('snackbar/reset_snackbar', null, { root: true });
  },
  async login({ commit, dispatch }, payload) {
    try {
      const response = await createAxiosInstance().post(
        '/authenticate',
        payload.data,
      );
      const token = response.data.token;
      document.cookie = `token=${token}; Path=/; Secure; SameSite=Strict`;
      if (payload.commit) {
        commit('mutate', { property: 'authenticate', with: { token } });
      }
      return response;
    } catch (error) {
      console.error('Login error:', error.response);
      dispatch(
        'snackbar/show_snackbar',
        {
          text:
            error.response.data._error.message.message || 'An error occurred',
          color: 'error',
        },
        { root: true },
      );
      throw error;
    }
  },
  async register(_, payload) {
    try {
      const response = await axios.post(
        process.env.VUE_APP_API_ROOT + '/register',
        payload.data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return response;
    } catch (error) {
      console.error('Register error:', error.response);
      throw error;
    }
  },
  logout({ commit }) {
    document.cookie =
      'token=; Path=/; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT';

    commit('mutate', {
      property: 'authenticate',
      with: {},
    });
  },
  revalidate_token({ commit }) {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      .split('=')[1];

    commit('mutate', {
      property: 'authenticate',
      with: { token },
    });
  },
};

export default new Vuex.Store({
  state: initialState,
  getters,
  mutations,
  actions,
  modules: {
    snackbar,
  },
});

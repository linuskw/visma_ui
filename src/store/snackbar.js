export const snackbar = {
    namespaced: true,
    state: {
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'error',
    },
    mutations: {
      SET_SNACKBAR(state, { text, color }) {
        state.snackbar = true;
        state.snackbarText = text;
        state.snackbarColor = color || 'error';
      },
      RESET_SNACKBAR(state) {
        state.snackbar = false;
        state.snackbarText = '';
        state.snackbarColor = 'error';
      },
    },
    actions: {
      show_snackbar({ commit }, { text, color }) {
        commit('SET_SNACKBAR', { text, color });
      },
      reset_snackbar({ commit }) {
        console.log("reset snackbar")
        commit('RESET_SNACKBAR');
      },
    },
  };
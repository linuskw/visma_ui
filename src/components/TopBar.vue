<template>
  <v-app-bar style='z-index:20001;' color="white">
    <v-btn text to="/"> Home </v-btn>
    <v-btn text to="/docs/wiki">
      Wiki Documents
    </v-btn>
    <v-btn text to="/docs/secret">
      Secret Documents
    </v-btn>
    <v-btn text to="/users"> Users </v-btn>

    <v-spacer />

    <div v-if="is_logged_in">User: {{ user_token.u_name }}</div>
    <v-btn text to="/logon" v-if="!is_logged_in"> Logon </v-btn>
    <v-btn text @click="handle_logout()" v-if="is_logged_in">
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'TopBar',
  computed: {
    ...mapGetters([
      'user_token',
    ]),
    ...mapState([
      'authenticate',
    ]),
    is_logged_in() {
      return this.user_token && this.check_token_expiry();
    },
  },
  methods: {
    ...mapActions(['set_state_property', 'logout', 'reset_state']),

    handle_logout() {
      this.reset_state();
      this.logout();
      this.$router.push('/');
    },
    check_token_expiry() {
      if (!this.user_token) {
        return false;
      }

      return this.user_token.exp > Date.now() / 1000;
    },
  },
};
</script>

<style scoped></style>

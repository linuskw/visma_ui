<template>
  <v-card
    min-width="300px"
    max-width="500px"
    min-height="300px"
    class="mx-auto ma-12"
    elevation="12"
  >
    <v-card-text class="justify-center text-center">
      <v-text-field autofocus v-model="username" label="Username" />
      <v-text-field v-model="password" label="Password" />
    </v-card-text>
    <v-card-actions style="gap: 10px;">
      <v-spacer />
      <v-btn @click="login_handler()"> Logon </v-btn>
      <v-btn @click="register_handler()"> Register </v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Logon',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    ...mapActions([
      'register',
      'login',
    ]),
    login_handler() {
      this.login({
        data: {
          username: this.username,
          password: this.password,
        },
        state_property: 'authenticate',
        commit: true,
      }).then((response) => {
        document.cookie = `token=${response.data.token}; Path=/; Secure; SameSite=Strict`;
        this.$router.push('/');
      });
    },
    register_handler() {
      this.register({
        data: {
          username: this.username,
          password: this.password,
        },
      }).then(() => {
        this.$router.push('/');
      });
    },
  },
};
</script>

<style scoped></style>

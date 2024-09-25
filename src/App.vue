<template>
  <div id="app">
    <TopBar />
    <v-container fluid>
      <v-row>
        <v-col align="center" justify="center">
          <router-view />
        </v-col>
      </v-row>
    </v-container>
    <Snackbar />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import TopBar from '@/components/TopBar';
import Snackbar from '@/components/Snackbar';

export default {
  name: 'App',
  components: {
    TopBar,
    Snackbar,
  },
  computed: {
    ...mapState('snackbar', ['snackbar', 'snackbarText', 'snackbarColor']),
  },
  methods: {
    ...mapActions(['revalidate_token']),
    ...mapActions('snackbar', ['resetSnackbar']),
  },
  mounted() {
    this.revalidate_token();
  },
};
</script>

<style></style>

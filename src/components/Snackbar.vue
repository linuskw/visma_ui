<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    :timeout="1500"
    bottom
    @input="(val) => !val && reset_snackbar()"
  >
    <div class="snackbar-text">{{ snackbarText }}</div>
  </v-snackbar>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Snackbar',
  computed: {
    ...mapState('snackbar', ['snackbar', 'snackbarText', 'snackbarColor']),
  },
  methods: {
    ...mapActions('snackbar', ['reset_snackbar']),
  },
};
</script>

<style scoped>
.snackbar-text {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

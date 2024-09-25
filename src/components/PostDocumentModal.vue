<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Create New Document</h2>
      <v-text-field v-model="headline" label="Headline" required></v-text-field>
      <v-textarea v-model="content" label="Content" required></v-textarea>
      <div class="modal-actions">
        <v-btn @click="$emit('close')">Cancel</v-btn>
        <v-btn @click="post_document">Post</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'PostDocumentModal',
  data() {
    return {
      headline: '',
      content: '',
    };
  },
  computed: {
    ...mapGetters([
      'user_token',
    ]),
    params() {
      return this.$route.params;
    },
  },
  methods: {
    ...mapActions(['api_post']),
    post_document() {
      this.api_post({
        url: `/${this.params.type}`,
        data: {
          headline: this.headline,
          content: this.content,
          author: this.user_token.u_name,
        },
        state_property: this.params.type,
        commit: true,
      });
      this.headline = '';
      this.content = '';
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  width: 80%;
  max-width: 500px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-actions button {
  margin-left: 10px;
}
</style>

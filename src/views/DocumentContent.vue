<template>
  <div class="document-container">
    <template v-if="!is_editing">
      <h2>{{ selected_item.headline }}</h2>
      <p>{{ selected_item.content }}</p>
      <p>Author:<i>{{ selected_item.author }}</i></p>
      <p>Created: {{ format_date(selected_item._created) }}</p>
      <v-btn @click="start_editing">Edit</v-btn>
    </template>
    <template v-else>
      <v-text-field v-model="edited_headline" label="Headline"></v-text-field>
      <v-textarea v-model="edited_content" label="Content"></v-textarea>
      <v-btn @click="save_changes">Save</v-btn>
      <v-btn @click="cancel_editing">Cancel</v-btn>
    </template>
    <v-btn @click="delete_doc()">Delete</v-btn>
    <v-btn @click="close_doc()">Close</v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { format_date } from '@/utils/format_date';

export default {
  name: 'DocumentContent',
  data() {
    return {
      is_editing: false,
      edited_headline: '',
      edited_content: '',
    };
  },
  computed: {
    ...mapGetters(['selected_item']),
    params() {
      return this.$route.params;
    },
  },
  created() {
    this.get_single_item();
  },
  methods: {
    ...mapActions(['api_delete', 'api_patch', 'api_get_single_item']),
    format_date,
    close_doc() {
      this.$router.push(`/docs/${this.params.type}`);
    },
    get_single_item() {
      this.api_get_single_item({
        url: `/${this.params.type}/${this.params.id}`,
        commit: true,
      });
    },
    async delete_doc () {
      await this.api_delete({
        url: `/${this.params.type}/${this.params.id}`,
        type: this.params.type,
        id: this.selected_item._id,
        etag: this.selected_item._etag,
        commit: true,
      });
      this.$router.push(`/docs/${this.params.type}`);
    },
    start_editing() {
      this.is_editing = true;
      this.edited_headline = this.selected_item.headline;
      this.edited_content = this.selected_item.content;
    },
    cancel_editing() {
      this.is_editing = false;
    },
    async save_changes() {
      await this.api_patch({
        url: `/${this.params.type}/${this.params.id}`,
        id: this.selected_item._id,
        etag: this.selected_item._etag,
        data: {
          headline: this.edited_headline,
          content: this.edited_content,
        },
        commit: true,
      });
      this.get_single_item();
      this.selected_item.headline = this.edited_headline;
      this.selected_item.content = this.edited_content;

      this.is_editing = false;
    },
  },
};
</script>

<style scoped>
.document-container {
  width: 100vw;
  height: calc(100vh - 64px);
  background-color: white;
  position: absolute;
  z-index: 100;
  top: 64px;
  left: 0;
  padding: 15px 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

h2 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 1rem;
}

.v-btn {
  margin-right: 10px;
  margin-bottom: 10px;
}

.v-text-field,
.v-textarea {
  margin-bottom: 1rem;
}
</style>

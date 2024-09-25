<template>
  <div>
    <DocumentContent
      v-if="this.$route.params.doc_id"
      :doc_id="this.$route.params.doc_id"
    />
    <CardList
      :items="documents"
      title_key="headline"
      content_key="content"
      :link_generator="document_link_generator"
    />
    <button v-if="documents.length" class="floating-button" @click="open_modal">+</button>
    <PostDocumentModal
      v-if="show_modal"
      @close="close_modal"
      @post="post_document"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import DocumentContent from './DocumentContent.vue';
import CardList from '../components/CardList.vue';
import PostDocumentModal from '@/components/PostDocumentModal.vue';

export default {
  name: 'Documents',
  components: { DocumentContent, CardList, PostDocumentModal },
  data() {
    return {
      show_modal: false,
    };
  },
  computed: {
    ...mapState(['secret', 'wiki']),
    documents() {
      return this.$store.state[this.$route.params.type]._items || [];
    },
  },
  methods: {
    ...mapActions(['api_get', 'api_post']),
    get_docs(path) {
      this.api_get({
        url: `/${path}`,
        params: {},
        state_property: path,
        commit: true,
      });
    },
    open_modal() {
      this.show_modal = true;
    },
    close_modal() {
      this.show_modal = false;
    },
    post_document(document_data) {
      this.api_post({
        url: `/${this.$route.params.type}`,
        data: document_data,
        commit: true,
      }).then(() => {
        this.get_docs(this.$route.params.type);
        this.close_modal();
      });
    },
    document_link_generator(item) {
      return `/docs/${this.$route.params.type}/${item._id}`;
    },
  },
  mounted() {
    this.get_docs(this.$route.params.type);
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.type !== from.params.type) {
      this.get_docs(to.params.type);
    }
    next();
  },
};
</script>

<style scoped>
.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #a0a0a0;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;
}

.floating-button:hover {
  background-color: #585858;
}
</style>

<template>
  <div>
    <user_content
      v-if="this.$route.params.user_id"
      :user_id="this.$route.params.user_id"
    />
    <card_list
      :items="users._items"
      title_key="username"
      content_key="_created"
      :link_generator="user_link_generator"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import card_list from '../components/CardList.vue';
import user_content from './UserContent.vue';

export default {
  name: 'Users',
  components: { card_list, user_content },
  data() {
    return {};
  },
  computed: {
    ...mapState(['users']),
  },
  methods: {
    ...mapActions(['api_get']),
    get_users() {
      this.api_get({
        url: '/users',
        params: {},
        state_property: 'users',
        commit: true,
      });
    },
    user_link_generator(item) {
      return `/users/${item._id}`;
    },
  },
  mounted() {
    this.get_users();
  },
};
</script>

<style scoped></style>

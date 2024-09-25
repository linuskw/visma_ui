<template>
  <v-card class="user_details_container">
    <div class="user_details_container_inner">
      <v-card-title class="text-center">User Details</v-card-title>
      <v-card-text v-if="selected_item">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Username</v-list-item-title>
            <v-text-field v-model="editedUser.username"></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content class="user_details_container_checkbox">
            <v-list-item-title>Access</v-list-item-title>
            <v-checkbox
              v-for="(access, index) in view_access_options"
              :key="'view-' + index"
              v-model="editedUser.view_access"
              :label="access.name"
              :value="access.value"
            ></v-checkbox>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Created</v-list-item-title>
            <v-list-item-subtitle>{{
              format_date(selected_item._created)
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Last Updated</v-list-item-title>
            <v-list-item-subtitle>{{
              format_date(selected_item._updated)
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
      <v-card-actions class="user_details_container_actions">
        <v-btn @click="go_back"> Go Back </v-btn>
        <v-btn @click="save_changes">Save Changes</v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { format_date } from '@/utils/format_date';

const access_options = [
  { name: 'Users', value: 'users' },
  { name: 'Secret documents', value: 'secret' },
  { name: 'Wiki documents', value: 'wiki' },
];

export default {
  name: 'UserContent',
  data() {
    return {
      editedUser: {
        username: '',
        role: '',
        view_access: [],
        edit_access: [],
      },
      view_access_options: access_options,
      edit_access_options: access_options,
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
    ...mapActions(['api_get_single_item', 'api_patch', 'reset_state']),
    format_date,
    go_back() {
      this.$router.push('/users');
    },
    get_single_item() {
      this.api_get_single_item({
        url: `/users/${this.params.id}`,
        commit: true,
      }).then(() => {
        this.editedUser = {
          username: this.selected_item.username,
          role: this.selected_item.role,
          view_access: this.selected_item.view_access,
          edit_access: this.selected_item.view_access,
        };
      });
    },
    save_changes() {
      this.api_patch({
        url: `/users/${this.params.id}`,
        id: this.selected_item._id,
        etag: this.selected_item._etag,
        data: this.editedUser,
        commit: true,
      }).then(() => {
        this.reset_state({
          state_properties: ['secret', 'wiki', 'users', 'selected_item'],
        });
        this.$router.push('/users');
      });
    },
  },
};
</script>

<style scoped>
.user_details_container {
  width: 100vw;
  height: calc(100vh - 64px);
  background-color: white;
  position: absolute;
  z-index: 100;
  top: 64px;
  left: 0;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}
.user_details_container_inner {
  width: 50%;
}
.text-center {
  justify-content: center;
}
.user_details_container_checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
}
.user_details_container_actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>

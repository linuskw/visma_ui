<template>
  <div class="card-list">
    <div v-if="items.length" class="card-grid">
      <CardItem
        v-for="item in items"
        :key="item._id"
        :item="item"
        :title_key="title_key"
        :content_key="content_key"
        :link_generator="link_generator"
      />
    </div>
  </div>
</template>

<script>
import CardItem from './CardItem.vue';

export default {
  name: 'CardList',
  components: {
    CardItem,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    title_key: {
      type: String,
      required: true,
    },
    content_key: {
      type: String,
      required: true,
    },
    link_generator: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>

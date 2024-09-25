<template>
  <div class="card">
    <router-link :to="itemLink" class="card-link">
      <h2 class="card-headline">{{ title }}</h2>
      <p class="card-content">{{ content }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'CardItem',
  props: {
    item: {
      type: Object,
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
  computed: {
    title() {
      return this.item[this.title_key];
    },
    content() {
      return this.item[this.content_key];
    },
    itemLink() {
      return this.link_generator(this.item);
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-link {
  display: block;
  padding: 16px;
  height: 200px;
  text-decoration: none;
  color: inherit;
}

.card-headline {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.card-content {
  font-size: 14px;
  color: #666;
  height: 90%;
  overflow: hidden;
}
</style>
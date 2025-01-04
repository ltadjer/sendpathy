<template>
  <post-list :posts="posts" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PostList from '@/components/Feed/PostList.vue';
import { usePostStore} from '@/stores/post';

export default defineComponent({
  name: 'FeedView',
  components: {
    PostList
  },
  async created() {
    await usePostStore().fetchAllPosts();
  },
  computed: {
    posts() {
      return usePostStore().posts;
    }
  },
});
</script>
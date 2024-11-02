<template>
  <post-list :posts="posts" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PostList from '@/components/Feed/PostList.vue';
import postService from '@/services/post.service';
import { useRoute } from 'vue-router';
import { onIonViewDidEnter, useIonRouter } from '@ionic/vue';

export default defineComponent({
  name: 'FeedView',
  components: {
    PostList
  },
  data() {
    return {
      posts: [],
    };
  },
  setup() {
    const router = useIonRouter();
    const route = useRoute();
    return { router, route };
  },
  mounted() {
    this.fetchAllPosts();
  },
  methods: {
    async fetchAllPosts() {
      const response = await postService.fetchAllPosts();
      this.posts = response;
    },
  }
});
</script>
<template>
  <ion-page>
    <post-list :posts="posts" :current-user="currentUser"/>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PostList from '@/components/Feed/PostList.vue';
import { usePostStore } from '@/stores/post';
import { useAccountStore } from '@/stores/account';
import { IonPage } from '@ionic/vue';

export default defineComponent({
  name: 'FeedView',
  components: {
    PostList,
    IonPage
  },
  async created() {
    await usePostStore().fetchAllPosts();
  },
  computed: {
    posts() {
      return usePostStore().posts.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    currentUser() {
      return useAccountStore().user;
    }
  },
});
</script>
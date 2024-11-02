<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Feed</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <post-form :post="selectedPost" @post-updated="fetchAllPosts"></post-form>
      <ion-list>
        <ion-item v-for="post in posts" :key="post.id" @click="editPost(post)">
          <p>{{ post.content }}</p>
          <ion-button slot="end" color="danger" @click.stop="deletePost(post.id)">Delete</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton } from '@ionic/vue';
import postService from '@/services/post.service';
import PostForm from '@/components/Feed/PostForm.vue';

export default defineComponent({
  name: 'PostList',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonButton,
    PostForm
  },
  data() {
    return {
      selectedPost: null,
    };
  },
  props: {
    posts: Array
  },
  methods: {
    editPost(post) {
      this.selectedPost = post;
    },
    async deletePost(postId) {
      await postService.deleteOnePost(postId);
      this.fetchAllPosts();
    }
  },

});
</script>
<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-padding header-page">
      <ion-toolbar>
        <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
          <div class="avatar-container" @click="showUserProfile(currentUser)">
            <ion-avatar slot="start">
              <img alt="User Avatar" :src="currentUser?.avatar" />
            </ion-avatar>
          </div>
          <ion-title>Feed</ion-title>
        </ion-item>
        <ion-buttons slot="end">
          <ion-button size="small" class="ion-no-shadow">
            <img alt="Logo" src="@/assets/logo.png" width="50px" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <post-list :posts="posts" :current-user="currentUser"/>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import PostList from '@/components/Feed/PostList.vue';
import { usePostStore } from '@/stores/post';
import { useAccountStore } from '@/stores/account';
import { IonPage, IonAvatar, IonHeader, IonToolbar, IonItem, IonTitle, IonButtons, IonButton, IonModal } from '@ionic/vue';
import ProfileView from '@/views/ProfileView.vue';

export default defineComponent({
  name: 'FeedView',
  components: {
    IonAvatar, IonHeader, IonToolbar, IonItem, IonTitle, IonButtons, IonButton,
    PostList,
    IonPage,
    IonModal,
    ProfileView
  },
  data() {
    return {
      isUserProfileModalOpen: false,
    };
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
  methods: {
    showUserProfile(user) {
      this.$router.push({ name: 'UserProfile', params: { userId: user.id } });
    },
  }
});
</script>
<style scoped>
@media (min-width: 768px) {
  ion-router-outlet .ion-page {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ion-content {
    width: 90%
  }
}

</style>
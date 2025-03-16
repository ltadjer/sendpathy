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
            <ion-icon class="custom-icon ion-margin-end" :icon="notificationsOutline" @click="goToNotifications"></ion-icon>
            <img alt="Logo" src="@/assets/logo.svg" width="70px" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <post-list :posts="posts" :current-user="currentUser"/>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import PostList from '@/components/Feed/PostList.vue';
import { usePostStore } from '@/stores/post';
import { useAccountStore } from '@/stores/account';
import { IonPage, IonAvatar, IonHeader, IonToolbar, IonItem, IonTitle, IonButtons, IonButton, IonModal, IonContent, IonIcon } from '@ionic/vue';
import ProfileView from '@/views/ProfileView.vue';
import { notificationsOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'FeedView',
  components: {
    IonIcon,
    IonAvatar, IonHeader, IonToolbar, IonItem, IonTitle, IonButtons, IonButton,
    PostList,
    IonPage,
    IonModal,
    IonContent,
    ProfileView
  },
  data() {
    return {
      isUserProfileModalOpen: false,
    };
  },
  setup() {
    return {
      notificationsOutline
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
    goToNotifications() {
      this.$router.push('/notifications');
    }
  }
});
</script>
<style scoped>
@media (min-width: 1024px) {
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
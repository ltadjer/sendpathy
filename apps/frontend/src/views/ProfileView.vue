<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-padding header-page">
      <ion-toolbar class="ion-no-shadow">
        <ion-buttons slot="start">
          <ion-back-button :defaultHref="true" :icon="arrowBackOutline" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- User Info Section -->
      <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
        <div class="avatar-container">
          <ion-avatar slot="start">
            <img alt="User Avatar" :src="currentUser.avatar" />
          </ion-avatar>
        </div>

        <div class="user-info">
          <ion-title>{{ currentUser.username }}</ion-title>
          <ion-text>{{ currentUser.biography }}</ion-text>
        </div>
        <custom-button slot="end" text="Modifier" @click="editProfile" />

      </ion-item>

      <!-- Stats Section -->
      <ion-grid class="ion-padding">
        <ion-row>
          <ion-col size="4">
            <ion-text>
              <h2>{{ posts.length }}</h2>
              <p>Posts</p>
            </ion-text>
          </ion-col>
          <ion-col size="4">
            <ion-text>
              <h2>{{ followers.length }}</h2>
              <p>Followers</p>
            </ion-text>
          </ion-col>
          <ion-col size="4">
            <ion-text>
              <h2>{{ followings.length }}</h2>
              <p>Following</p>
            </ion-text>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-segment v-model="selectedSegment" class="ion-padding segment-tabs">
        <ion-segment-button value="posts" :class="{'ion-shadow-in': selectedSegment === 'posts'}">
          <ion-label><span :class="{'gradient-text': selectedSegment === 'posts'}">Posts</span></ion-label>
        </ion-segment-button>
        <ion-segment-button value="lifeMoments" :class="{'ion-shadow-in': selectedSegment === 'lifeMoments'}">
          <ion-label><span :class="{'gradient-text': selectedSegment === 'lifeMoments'}">Moments</span></ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Post and Life Moments Lists -->
      <post-list v-if="selectedSegment === 'posts'" :posts="posts" :current-user="currentUser" />
      <life-moment-list v-if="selectedSegment === 'lifeMoments'" :life-moments="lifeMoments" :current-user="currentUser" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonButtons, IonButton, IonGrid, IonRow, IonCol, IonText, IonThumbnail, IonLabel, IonSegment, IonSegmentButton, IonBackButton } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { formatDate } from '@/utils/date';
import { usePostStore } from '@/stores/post';
import { useAccountStore } from '@/stores/account';
import { useLifeMomentStore } from '@/stores/life-moment';
import PostList from '@/components/Feed/PostList.vue';
import LifeMomentList from '@/components/LifeMoment/LifeMomentList.vue';
import CustomButton from '@/components/Commun/CustomButton.vue';

export default defineComponent({
  name: 'ProfilePage',
  components: {
    CustomButton,
    IonBackButton,
    IonSegmentButton,
    IonSegment,
    LifeMomentList,
    PostList,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonButtons,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonThumbnail,
    IonLabel
  },
  data() {
    return {
      selectedSegment: 'posts', // Default value
    };
  },
  setup() {
    return { arrowBackOutline };
  },
  async created() {
    await usePostStore().fetchAllPosts();
    await useLifeMomentStore().fetchLifeMoments();
  },
  computed: {
    posts() {
      return usePostStore().posts.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    lifeMoments() {
      return useLifeMomentStore().lifeMoments.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    currentUser() {
      return useAccountStore().user;
    },
    followers() {
      return this.currentUser ? this.currentUser.friendshipsReceived.filter(friendship => friendship.status === 'ACCEPTED').map(friendship => friendship.requester) : [];
    },
    followings() {
      return this.currentUser ? this.currentUser.friendshipsSent.filter(friendship => friendship.status === 'ACCEPTED').map(friendship => friendship.receiver) : [];
    }
  },
  methods: {
    formatDate,
  },
});
</script>

<style scoped>
ion-avatar {
  width: 60px;
  height: 60px;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

custom-button {
  align-self: end;
}

ion-text h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: bold;
}

ion-text p {
  margin: 0;
  font-size: 1rem;
  color: gray;
}

.segment-tabs {
  margin-top: 1rem;
}

</style>

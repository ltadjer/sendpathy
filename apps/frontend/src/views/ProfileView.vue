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
      <ion-item lines="none" class="ion-margin">
        <ion-grid class="ion-padding">
          <ion-row>
            <ion-col>
              <ion-item class="ion-no-shadow" lines="none">
                <div class="avatar-container">
                  <ion-avatar slot="start">
                    <img :src="user?.avatar" alt="User Avatar" />
                  </ion-avatar>
                </div>

                <div class="user-info ion-margin-start">
                  <ion-label v-if="user.age" class="sub-header">{{ user?.age }} ans</ion-label>
                  <ion-title class="ion-no-padding">{{ user?.username }}</ion-title>
                </div>
                <custom-button slot="end" text="Modifier" @click="openModal" v-if="isCurrentUser" />
                <ion-button slot="end" @click="toggleFriendship" v-if="!isCurrentUser">
                  {{ isFriend ? 'Remove Friend' : 'Add Friend' }}
                </ion-button>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-text class="ion-padding-start">{{ user?.biography }}</ion-text>
            </ion-col>
          </ion-row>
          <ion-row class="stats ion-margin ion-justify-content-center">
            <ion-col size="4">
              <ion-text>
                <h2>{{ filteredPosts.length }}</h2>
                <p>Posts</p>
              </ion-text>
            </ion-col>
            <ion-col size="4" @click="openFriendshipsModal('followers')">
              <ion-text>
                <h2>{{ followers?.length }}</h2>
                <p>Followers</p>
              </ion-text>
            </ion-col>
            <ion-col size="4" @click="openFriendshipsModal('followings')">
              <ion-text>
                <h2>{{ followings?.length }}</h2>
                <p>Following</p>
              </ion-text>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>

      <ion-segment v-model="selectedSegment" class="ion-padding">
        <ion-segment-button value="posts" :class="{'ion-shadow-in': selectedSegment === 'posts'}">
          <ion-label><span :class="{'gradient-text': selectedSegment === 'posts'}">Posts</span></ion-label>
        </ion-segment-button>
        <ion-segment-button value="lifeMoments" :class="{'ion-shadow-in': selectedSegment === 'lifeMoments'}" v-if="isCurrentUser">
          <ion-label><span :class="{'gradient-text': selectedSegment === 'lifeMoments'}">Moments</span></ion-label>
        </ion-segment-button>
      </ion-segment>

      <post-list v-if="selectedSegment === 'posts'" :posts="filteredPosts" :current-user="user" />
      <life-moment-list v-if="selectedSegment === 'lifeMoments' && isCurrentUser" :life-moments="filteredLifeMoments" :current-user="user" />
      <profile-edit-modal :is-open="isModalOpen" :current-user="user" @close="closeModal" @save="updateUserProfile" />
      <profile-friendships-modal
        :is-open="isFriendshipsModalOpen"
        :followers="followers"
        :followings="followings"
        :initial-segment="initialSegment"
        @close="closeFriendshipsModal"
        @remove="removeUser"
        @open-profile="showUserProfile"
      />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonButtons, IonButton, IonLabel, IonInput, IonModal, IonFooter, IonIcon, IonGrid,
  IonRow, IonCol, IonText, IonSegment, IonSegmentButton, IonBackButton } from '@ionic/vue';
import { arrowBackOutline, closeOutline } from 'ionicons/icons';
import { usePostStore } from '@/stores/post';
import { useLifeMomentStore } from '@/stores/life-moment';
import PostList from '@/components/Feed/PostList.vue';
import LifeMomentList from '@/components/LifeMoment/LifeMomentList.vue';
import CustomButton from '@/components/Commun/CustomButton.vue';
import ProfileEditModal from '@/components/Profile/ProfileEditModal.vue';
import ProfileFriendshipsModal from '@/components/Profile/ProfileFriendshipsModal.vue';
import { useRouter, useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/account';
import { useFriendshipStore } from '@/stores/friendship';

export default defineComponent({
  name: 'ProfilePage',
  components: {
    CustomButton,
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
    IonLabel,
    IonInput,
    IonModal,
    IonFooter,
    IonIcon,
    IonBackButton,
    IonGrid,
    IonRow, IonCol, IonText, IonSegment, IonSegmentButton,
    PostList,
    LifeMomentList,
    ProfileEditModal,
    ProfileFriendshipsModal
  },
  data() {
    return {
      selectedSegment: 'posts', // Default value
      isModalOpen: false,
      isFriendshipsModalOpen: false,
      initialSegment: 'followers',
      selectedUser: null,
      username: '',
      biography: ''
    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const accountStore = useAccountStore();
    const friendshipStore = useFriendshipStore();
    const currentUser = accountStore.user;
    const userId = route.params.userId;

    const user = ref(null);
    const isFriend = ref(false);

    if (currentUser.id === userId) {
      user.value = currentUser;
    } else {
      const followers = currentUser.friendshipsReceived?.filter(friendship => friendship.status === 'ACCEPTED').map(friendship => friendship.requester) || [];
      const followings = currentUser.friendshipsSent?.filter(friendship => friendship.status === 'ACCEPTED').map(friendship => friendship.receiver) || [];
      user.value = followers.find(user => user.id === userId) || followings.find(user => user.id === userId) || {};
      isFriend.value = !!followers.find(user => user.id === userId) || !!followings.find(user => user.id === userId);
    }
    // TODO: récuperer l'id de la friendship pour la supprimer et tenir en compte de si c'est deja accepted ou pas
    const toggleFriendship = async () => {
      if (isFriend.value) {
        // Remove friend
        await friendshipStore.deleteOneFriendship(user.value.id);
      } else {
        // Add friend
        await friendshipStore.createOneFriendship(user.value.id);
      }
      isFriend.value = !isFriend.value;
    };

    return { arrowBackOutline, closeOutline, router, accountStore, user, isFriend, toggleFriendship };
  },
  async created() {
    await usePostStore().fetchAllPosts();
    await useLifeMomentStore().fetchLifeMoments();
  },
  computed: {
    currentUser() {
      return this.accountStore.user;
    },
    posts() {
      return usePostStore().posts.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    lifeMoments() {
      return useLifeMomentStore().lifeMoments.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    filteredPosts() {
      return this.posts.filter(post => post.userId === this.user.id);
    },
    filteredLifeMoments() {
      return this.lifeMoments.filter(lifeMoment => lifeMoment.userId === this.user.id);
    },
    followers() {
      return this.user ? this.user.friendshipsReceived?.filter(friendship => friendship.status === 'ACCEPTED').map(friendship => friendship.requester) : [];
    },
    followings() {
      return this.user ? this.user.friendshipsSent?.filter(friendship => friendship.status === 'ACCEPTED').map(friendship => friendship.receiver) : [];
    },
    isCurrentUser() {
      return this.currentUser.id === this.user.id;
    }
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    updateUserProfile(updatedUser) {
      this.user.username = updatedUser.username;
      this.user.biography = updatedUser.biography;
    },
    openFriendshipsModal(segment) {
      this.initialSegment = segment;
      this.isFriendshipsModalOpen = true;
    },
    closeFriendshipsModal() {
      this.isFriendshipsModalOpen = false;
    },
    removeUser({ userId, type }) {
      if (type === 'followers') {
        this.followers = this.followers.filter(user => user.id !== userId);
      } else {
        this.followings = this.followings.filter(user => user.id !== userId);
      }
    },
    showUserProfile(user) {
      this.router.push({ name: 'UserProfile', params: { userId: user.id } });
    }
  }
});
</script>
<style scoped>
.sub-header {
  font-size: 0.9rem;
  color: gray;
  font-weight: 400;
}

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

.stats ion-col {
  justify-content: start;
  align-items: center;
  display: flex;
}

ion-modal {
  --min-height: 50%;
}

ion-list {
  padding: 0;
}

ion-item {
  margin-bottom: 0.5rem;
}

</style>

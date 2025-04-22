<template>
  <ion-page>
    <div class="container" v-if="isDesktop">
      <aside class="sidebar" :class="{ 'hidden': isSidebarHidden }">
        <ion-item lines="none" class="ion-no-shadow">
          <div class="avatar-container" @click="showUserProfile(currentUser)">
            <ion-avatar slot="start">
              <img alt="User Avatar" :src="currentUser?.avatar" />
            </ion-avatar>
          </div>
        </ion-item>

        <nav>
          <custom-button :class="{ 'ion-shadow-in': isActiveTab('/feed') }" text="Feed" href="/feed" />
          <custom-button text="Moments de vie" href="/journal" />
          <custom-button text="Messages" href="/conversations" />
          <custom-button text="Consultations" href="/reservations" />
        </nav>

        <div class="rounded-buttons">
          <custom-button class="ion-margin-end" :icon="settingsOutline" href="/parametres" />
          <custom-button color="primary" @click="logout" :icon="logOutOutline" />
        </div>


      </aside>

      <ion-router-outlet></ion-router-outlet>
    </div>
    <div v-else class="mobile-nav">
      <ion-fab horizontal="center" vertical="bottom">
        <ion-fab-button @click="openFormModal">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom" class="ion-margin">
          <ion-tab-button :class="{ 'ion-shadow-in': isActiveTab('/feed') }" tab="feed" href="/feed">
            <ion-icon :icon="homeOutline"></ion-icon>
          </ion-tab-button>
          <ion-tab-button :class="{ 'ion-shadow-in': isActiveTab('/journal') }" tab="libray" href="/journal">
            <ion-icon :icon="journalOutline" />
          </ion-tab-button>
          <ion-tab-button :class="{ 'ion-shadow-in': isActiveTab('/conversations') }" tab="chatbubblesOutline" href="/conversations">
            <ion-icon :icon="chatbubblesOutline" />
          </ion-tab-button>
          <ion-tab-button :class="{ 'ion-shadow-in': isActiveTab('/reservations') }" tab="reservations" href="/reservations">
            <ion-icon :icon="todayOutline" />
          </ion-tab-button>
          <ion-tab-button :class="{ 'ion-shadow-in': isActiveTab('/parametres') }" tab="settings" href="/parametres">
            <ion-icon :icon="settingsOutline" />
          </ion-tab-button>
          <ion-tab-button @click="logout">
            <ion-icon :icon="logOutOutline" />
          </ion-tab-button>
        </ion-tab-bar>
        <post-form-modal v-if="isPostFormModalOpen" @close="closePostFormModal" :current-user="currentUser"/>
        <life-moment-form-modal v-if="isLifeMomentModalOpen" @close="closeLifeMomentModal"/>
        <friendships-modal
          :is-open="isFriendshipsModalOpen"
          :friends-list="friendsList"
          @close="closeFriendshipsModal"
          @select="handleFriendSelection"
        />
      </ion-tabs>
    </div>
  </ion-page>
</template>
<script lang="ts">
import { IonPage, IonAvatar, IonItem, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonFab, IonFabButton, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonList, IonLabel } from '@ionic/vue';
import { settingsOutline, homeOutline, chatbubblesOutline, journalOutline, todayOutline, add, logOutOutline } from 'ionicons/icons';
import PostFormModal from '@/components/Feed/PostFormModal.vue';
import LifeMomentFormModal from '@/components/LifeMoment/LifeMomentFormModal.vue';
import { useAccountStore } from '@/stores/account';
import { defineComponent } from 'vue';
import CustomButton from '@/components/Commun/CustomButton.vue'
import { useConversationStore } from '@/stores/conversation';
import FriendshipsModal from '@/components/Message/FriendshipsModal.vue'

export default defineComponent({
  name: 'MainHeader',
  components: {
    FriendshipsModal, CustomButton, IonPage, IonAvatar, IonItem, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonFab, IonFabButton, PostFormModal, LifeMomentFormModal, IonButton,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonList, IonLabel },
  data() {
    return {
      homeOutline,
      chatbubblesOutline,
      journalOutline,
      settingsOutline,
      todayOutline,
      add,
      logOutOutline,
      isPostFormModalOpen: false,
      isLifeMomentModalOpen: false,
      isFriendshipsModalOpen: false,
    };
  },
  computed: {
    currentUser() {
      return useAccountStore().user;
    },
    currentRoute() {
      return this.$route.path;
    },
    isDesktop() {
      return window.innerWidth > 992;
    },
    friendsList() {
      const received = this.currentUser?.friendshipsReceived
        ?.filter(friendship => friendship.status === 'ACCEPTED')
        .map(friendship => friendship.requester) || [];

      const sent = this.currentUser?.friendshipsSent
        ?.filter(friendship => friendship.status === 'ACCEPTED')
        .map(friendship => friendship.receiver) || [];

      return received.filter(friend =>
        sent.some(sentFriend => sentFriend.id === friend.id)
      );
    },
  },
  methods: {
    openFormModal() {
      if (this.$route.path === '/journal') {
        this.isLifeMomentModalOpen = true;
      } else if (this.$route.path === '/reservations') {
        this.$router.push('/reservations/nouvelle-reservation/');
      } else if (this.$route.path === '/feed') {
        this.isPostFormModalOpen = true;
      } else if (this.$route.path === '/conversations') {
        this.isFriendshipsModalOpen = true;
      }
    },
    closeFriendshipsModal() {
      this.isFriendshipsModalOpen = false;
    },
    async handleFriendSelection(friend) {
      const conversationStore = useConversationStore();
      const existingConversation = conversationStore.conversations.find(
        conversation => conversation.user?.id === friend.id
      );

      if (existingConversation) {
        this.$router.push(`/conversations/${existingConversation.id}`);
      } else {
        const newConversation = await conversationStore.createOneConversation({
          userIds: [this.currentUser.id, friend.id],
          conversationType: 'PRIVATE',
        });
        this.$router.push(`/conversations/${newConversation.id}`);
      }

      this.closeFriendshipsModal();
    },
    closePostFormModal() {
      this.isPostFormModalOpen = false;
    },
    closeLifeMomentModal() {
      this.isLifeMomentModalOpen = false;
    },
    async logout() {
      const accountStore = useAccountStore();
      await accountStore.logout();
      this.$router.push('/connexion');
    },
    isActiveTab(tabPath: string): boolean {
      return this.currentRoute === tabPath;
    }
  }
});
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 280px; /* Largeur fixe */
  padding: 20px;
  background: #f5f5fa;
  box-shadow: var(--neumorphism-out-shadow);
  margin: 1rem;
  border-radius: 1rem;
  flex-shrink: 0; /* Empêche la réduction */
  z-index: 100000;
  display: flex
;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}


ion-router-outlet {
  flex-grow: 1;
  margin-left: auto;
  width: calc(100% - 300px);
}

@media (max-width: 1024px) {
  .container {
    flex-direction: column;
  }

  main {
    width: 100%;
  }
}

nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 80%;
}

ion-fab {
  bottom: 59px
}

.rounded-buttons ion-button {
  --border-radius: 50% !important;
}

nav ion-button {
  display: block;
  margin: 10px 0;
  text-align: left;
  color: #333;
}

.avatar-container {
  padding: 0.4rem;
  margin-right: 20px;
}

ion-avatar {
  width: 80px;
  height: 80px;
}

main {
  flex-grow: 1;
  padding: 20px;
}

@media (max-width: 1024px) {
  ion-router-outlet {
    width: 100%;
  }
  ion-tabs {
    background: var(--ion-color-primary);
  }
}
</style>


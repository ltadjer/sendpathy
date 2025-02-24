<template>
  <ion-page>
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
    </ion-tabs>
  </ion-page>
</template>
<script lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonFab, IonFabButton } from '@ionic/vue';
import { settingsOutline, homeOutline, chatbubblesOutline, journalOutline, todayOutline, add, logOutOutline } from 'ionicons/icons';
import PostFormModal from '@/components/Feed/PostFormModal.vue';
import LifeMomentFormModal from '@/components/LifeMoment/LifeMomentFormModal.vue';
import { useAccountStore } from '@/stores/account';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainHeader',
  components: { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonFab, IonFabButton, PostFormModal, LifeMomentFormModal },
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
      isLifeMomentModalOpen: false
    };
  },
  computed: {
    currentUser() {
      return useAccountStore().user;
    },
    currentRoute() {
      return this.$route.path;
    }
  },
  methods: {
    openFormModal() {
      if (this.$route.path === '/journal') {
        this.isLifeMomentModalOpen = true;
      } else {
        this.isPostFormModalOpen = true;
      }
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
ion-fab {
  bottom: 59px
}
</style>

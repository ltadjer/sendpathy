<template>
  <ion-fab horizontal="center" vertical="bottom">
    <ion-fab-button @click="openPostFormModal">
      <ion-icon :icon="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  <ion-tabs>
    <ion-router-outlet></ion-router-outlet>
    <ion-tab-bar slot="bottom" class="ion-margin">
      <ion-tab-button tab="feed" href="/feed">
        <ion-icon :icon="homeOutline"></ion-icon>
      </ion-tab-button>
      <ion-tab-button tab="libray" href="/journal">
        <ion-icon :icon="journalOutline" />
      </ion-tab-button>
      <ion-tab-button tab="chatbubblesOutline" href="/conversations">
        <ion-icon :icon="chatbubblesOutline" />
      </ion-tab-button>
      <ion-tab-button tab="reservations" href="/reservations">
        <ion-icon :icon="todayOutline" />
      </ion-tab-button>
      <ion-tab-button tab="settings" href="/parametres">
        <ion-icon :icon="settingsOutline" />
      </ion-tab-button>
    </ion-tab-bar>
    <post-form-modal v-if="isPostFormModalOpen" @close="closePostFormModal" />
  </ion-tabs>
</template>

<script lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonFab, IonFabButton } from '@ionic/vue';
import { settingsOutline, homeOutline, chatbubblesOutline, journalOutline, todayOutline, add } from 'ionicons/icons';
import PostFormModal from '@/components/Feed/PostFormModal.vue';

export default {
  name: 'MainHeader',
  components: { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonFab, IonFabButton, PostFormModal },
  data() {
    return {
      homeOutline,
      chatbubblesOutline,
      journalOutline,
      settingsOutline,
      todayOutline,
      add,
      isPostFormModalOpen: false
    };
  },
  methods: {
    openPostFormModal() {
      this.isPostFormModalOpen = true;
    },
    closePostFormModal() {
      this.isPostFormModalOpen = false;
    }
  }
};
</script>
<style scoped>
ion-fab {
  bottom: 59px
}
</style>

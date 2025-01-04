<template>
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
    </ion-tabs>
</template>

<script lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon } from '@ionic/vue';
import { settingsOutline, homeOutline, chatbubblesOutline, journalOutline, todayOutline } from 'ionicons/icons';

export default {
  components: { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon },
  data() {
    return {
      homeOutline,
      chatbubblesOutline,
      journalOutline,
      settingsOutline,
      todayOutline
    };
  },
};
</script>
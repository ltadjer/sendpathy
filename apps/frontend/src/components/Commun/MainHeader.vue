<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="Feed" href="/feed">
          <ion-icon :icon="chatboxOutline"></ion-icon>
          <ion-label>Feed</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="libray" href="/life-moments">
          <ion-icon :icon="libray" />
          <ion-label>LifeMoments</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="radio" href="/conversations">
          <ion-icon :icon="radio" />
          <ion-label>Messagerie</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';

import { chatboxOutline, radio, library, search } from 'ionicons/icons';

export default {
  components: { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon },
  data() {
    return {
      chatboxOutline,
      radio,
      library,
      search,
    };
  },
  created() {
    console.log('MainHeader component created');
  }
};
</script>
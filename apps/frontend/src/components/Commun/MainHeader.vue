<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="Feed" href="/">
          <ion-icon :icon="playCircle" />
          <ion-label>Feed</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="radio" href="/life-moments">
          <ion-icon :icon="radio" />
          <ion-label>LifeMoments</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';

import { playCircle, radio, library, search } from 'ionicons/icons';

export default {
  components: { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon },
  data() {
    return {
      playCircle,
      radio,
      library,
      search,
    };
  },
};
</script>
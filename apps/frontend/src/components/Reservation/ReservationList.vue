<template>
  <ion-header :translucent="true" class="ion-padding header-page">
    <ion-toolbar>
      <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
        <div class="avatar-container">
          <ion-avatar slot="start">
            <img alt="User Avatar" :src="currentUser?.avatar" />
          </ion-avatar>
        </div>
        <ion-title>Réservations</ion-title>
      </ion-item>
      <ion-buttons slot="end">
        <ion-button size="small" class="ion-no-shadow">
          <img alt="Logo" src="@/assets/logo.png" width="50px" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-item v-for="reservation in reservations" :key="reservation.id">
        <ion-label>
          <h2>{{ reservation.title }}</h2>
          <p>{{ reservation.date }}</p>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonAvatar, IonButtons,IonButton} from '@ionic/vue'
export default defineComponent({
  name: 'ReservationList',
  components: {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonAvatar, IonButtons, IonButton},
  props: {
    currentUser: {
      type: Object,
      required: true
    },
    reservations: {
      type: Array,
      required: true
    }
  },
});
</script>
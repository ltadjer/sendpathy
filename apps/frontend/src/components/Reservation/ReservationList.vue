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
    <ion-list class="ion-padding-start ion-padding-end">
      <ion-card v-for="reservation in reservations" :key="reservation.id">
        <ion-card-header>
          <ion-grid>
            <ion-row>
              <ion-col size="6">
          <ion-card-subtitle>Date</ion-card-subtitle>
          <ion-card-title>{{ formatDate(reservation.slot.startTime) }}</ion-card-title>
              </ion-col>
              <ion-col size="6">

          <ion-card-subtitle>Heure</ion-card-subtitle>
          <ion-card-title>{{ formatTime(reservation.slot.startTime) }} - {{ formatTime(reservation.slot.endTime) }}</ion-card-title>
              </ion-col>
            </ion-row>
          </ion-grid>

        </ion-card-header>

        <ion-card-content>
          <a v-if="reservation.videoCallLink" :href="reservation.videoCallLink" target="_blank">Join Video Call</a>
        </ion-card-content>
        <ion-grid>
          <ion-row>
            <ion-col size="6">
              <ion-button class="ion-no-shadow" fill="clear">Déplacer le RDV</ion-button>
            </ion-col>
            <ion-col size="6">
              <ion-button class="ion-no-shadow" fill="clear">Annuler le RDV</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card>
    </ion-list>
  </ion-content>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonAvatar, IonButtons,IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonCardContent, IonCardHeader, IonGrid, IonRow,IonCol} from '@ionic/vue'
import {formatTime} from '@/utils/date'
export default defineComponent({
  name: 'ReservationList',
  components: {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonAvatar, IonButtons, IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonCardContent, IonCardHeader, IonGrid, IonRow,IonCol},
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
  methods: {
    formatTime,
    formatDate(date: string) {
      return new Date(date).toLocaleDateString()
    }
  }
});
</script>
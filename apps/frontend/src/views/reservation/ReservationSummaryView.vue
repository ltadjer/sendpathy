<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Résumé de la Réservation</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label>Date: {{ reservation.date }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Heure: {{ reservation.time }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Thérapeute: {{ therapist.name }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Description: {{ therapist.description }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-img :src="therapist.image" alt="Therapist Image"></ion-img>
        </ion-item>
      </ion-list>
      <ion-button expand="full" @click="createOneReservation">Confirmer</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonImg, IonButton } from '@ionic/vue';
import { useReservationStore } from '@/stores/reservation';
import ReservationService from '@/services/reservation.service';

export default defineComponent({
  name: 'ReservationSummaryView',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonImg, IonButton },
  setup() {
    const reservationStore = useReservationStore();
    return {
      reservation: reservationStore.reservation,
      therapist: reservationStore.therapist,
    };
  },
  methods: {
    async createOneReservation() {
      const reservationStore = useReservationStore();
      await ReservationService.createOneReservation({
        date: reservationStore.reservation.date,
        title: reservationStore.reservation.title,
      });
      this.$router.push('/reservations');
    },
  },
});
</script>
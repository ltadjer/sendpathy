<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Nouvelle Réservation</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label>Date:</ion-label>
          <ion-datetime display-format="YYYY-MM-DD" v-model="date"></ion-datetime>
        </ion-item>
        <ion-item>
          <ion-label>Titre:</ion-label>
          <ion-input v-model="title" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>
            <h2>Thérapeute</h2>
            <p>{{ therapist.name }}</p>
            <p>{{ therapist.description }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-button expand="full" @click="redirectToConfirm">Réserver</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonDatetime, IonButton, IonInput } from '@ionic/vue';
import { useReservationStore } from '@/stores/reservation';

export default defineComponent({
  name: 'NewReservationView',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonDatetime, IonButton, IonInput },
  data() {
    return {
      date: '',
      title: '',
      therapist: {
        name: 'John Doe',
        description: 'Thérapeute expérimenté',
        image: '/images/therapist.jpg',
      },
    };
  },
  methods: {
    redirectToConfirm() {
      const reservationStore = useReservationStore();
      reservationStore.setReservation({
        date: this.date,
        title: this.title,
      });
      reservationStore.setTherapist(this.therapist);
      this.$router.push('/reservations/summary');
    },
  },
});
</script>
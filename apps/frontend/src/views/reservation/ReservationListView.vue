<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Mes Réservations</ion-title>
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
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/vue'
import ReservationService from '@/services/reservation.service'

export default defineComponent({
  name: 'ReservationListView',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel },
  data() {
    return {
      reservations: [],
    };
  },
  mounted() {
    this.fetchAllReservations();
  },
  methods: {
    async fetchAllReservations() {
      this.reservations = await ReservationService.fetchAllReservations();
    },
  },
});
</script>
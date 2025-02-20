<template>
  <ion-page>
    <reservation-list :reservations="reservations" :current-user="currentUser"/>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonPage } from '@ionic/vue'
import { useReservationStore } from '@/stores/reservation'
import { useAccountStore } from '@/stores/account'
import ReservationList from '@/components/Reservation/ReservationList.vue'

export default defineComponent({
  name: 'ReservationView',
  components: {
    ReservationList,
    IonPage
  },
  computed: {
    reservations() {
      return useReservationStore().reservations?.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    currentUser() {
      return useAccountStore().user;
    }
  },
  async created() {
    await useReservationStore().fetchAllReservations();
  }
});
</script>
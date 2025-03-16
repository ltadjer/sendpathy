<template>
  <ion-page>
    <reservation-list :reservations="reservations" :current-user="currentUser" :therapists="therapists"/>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonPage } from '@ionic/vue'
import { useReservationStore } from '@/stores/reservation'
import { useAccountStore } from '@/stores/account'
import ReservationList from '@/components/Reservation/ReservationList.vue'
import authService from '@/services/auth.service'

export default defineComponent({
  name: 'ReservationView',
  components: {
    ReservationList,
    IonPage
  },
  data() {
    return {
      therapists: []
    }
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
    this.therapists = await authService.fetchAllTherapists();
  }
});
</script>
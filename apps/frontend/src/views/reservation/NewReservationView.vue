<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-padding header-page">
      <ion-toolbar>
        <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
          <div class="avatar-container">
            <ion-avatar slot="start">
              <img alt="User Avatar" :src="currentUser?.avatar" />
            </ion-avatar>
          </div>
          <ion-title>{{ reservationId ? 'Modifier la réservation' : 'Nouvelle réservation' }}</ion-title>
        </ion-item>
        <ion-buttons slot="end">
          <ion-button size="small" class="ion-no-shadow">
            <img alt="Logo" src="@/assets/logo.png" width="50px" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ReservationForm
        :available-slots-by-date="availableSlotsByDate"
        v-model:selected-slot="selectedSlot"
        :therapists="therapists"
        v-model:selected-therapist="selectedTherapist"
        :reservation-id="reservationId"
        @reservation-submitted="handleReservationSubmitted"
      />
      <ToastMessage/>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import availableSlotService from '@/services/available-slot.service';
import authService from '@/services/auth.service';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonAvatar, IonButtons, IonButton } from '@ionic/vue';
import { useAccountStore } from '@/stores/account';
import ToastMessage from '@/components/Commun/ToastMessage.vue';
import ReservationForm from '@/components/Reservation/ReservationForm.vue';
import { useReservationStore } from '@/stores/reservation';
import { formatDate } from '@/utils/date';

export default defineComponent({
  data() {
    return {
      availableSlotsByDate: {},
      selectedSlot: null,
      therapists: [],
      selectedTherapist: null,
      reservationId: null,
    };
  },
  components: {
    ToastMessage,
    ReservationForm,
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonAvatar, IonButtons, IonButton
  },
  computed: {
    currentUser() {
      return useAccountStore().user;
    },
  },
  async created() {
    const slots = await availableSlotService.fetchAllAvailableSlots();
    this.availableSlotsByDate = this.groupSlotsByDate(slots);
    this.therapists = await authService.fetchAllTherapists();
    this.reservationId = this.$route.params.reservationId;
    if (this.reservationId) {
      await this.loadReservationData();
    }
  },
  methods: {
    formatDate,
    groupSlotsByDate(slots) {
      slots.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      return slots.reduce((acc, slot) => {
        const date = this.formatDate(slot.startTime);
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(slot);
        return acc;
      }, {});
    },
    async loadReservationData() {
      const reservation = await useReservationStore().fetchOneReservationById(this.reservationId);
      this.selectedSlot = reservation.slotId;
      this.selectedTherapist = reservation.slot.therapistId;
    },
    handleReservationSubmitted() {
      this.$router.push({ name: 'ReservationList' });
    }
  }
});
</script>
<style scoped>

@media (min-width: 1024px) {
  .ion-page {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ion-content {
    width: 60%;
  }

}


</style>
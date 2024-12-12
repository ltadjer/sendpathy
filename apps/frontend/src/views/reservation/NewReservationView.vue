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
          <ion-label>Titre:</ion-label>
          <ion-input v-model="title" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Thérapeute:</ion-label>
          <ion-select v-model="selectedTherapist" @ionChange="fetchAvailableSlots">
            <ion-select-option v-for="therapist in therapists" :key="therapist.id" :value="therapist">
              {{ therapist.username }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item v-if="availableSlots.length">
          <ion-label>Date et Heure:</ion-label>
          <ion-accordion-group>
            <ion-accordion v-for="(slots, date) in availableSlots" :key="date">
              <ion-item slot="header">
                <ion-label>{{ date }}</ion-label>
              </ion-item>
              <ion-list slot="content">
                <ion-item v-for="slot in slots" :key="slot.startTime" @click="selectSlot(slot)">
                  <ion-label>{{ slot.startTime }} - {{ slot.endTime }}</ion-label>
                </ion-item>
              </ion-list>
            </ion-accordion>
          </ion-accordion-group>
        </ion-item>
      </ion-list>
      <ion-button expand="full" @click="redirectToConfirm">Réserver</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonAccordionGroup, IonAccordion, IonButton, IonInput } from '@ionic/vue';
import reservationService from '@/services/reservation.service';
import authService from '@/services/auth.service';
import { useReservationStore } from '@/stores/reservation';

export default defineComponent({
  name: 'NewReservationView',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonAccordionGroup, IonAccordion, IonButton, IonInput },
  data() {
    return {
      title: '',
      selectedTherapist: null,
      therapists: [],
      availableSlots: {},
    };
  },
  async created() {
    this.therapists = await authService.fetchAllTherapists();
  },
  methods: {
    async fetchAvailableSlots() {
      if (this.selectedTherapist) {
        // Fetch available slots for the selected therapist
        const slots = await reservationService.fetchAllAvailableSlots(this.selectedTherapist.id);
        this.availableSlots = this.groupSlotsByDate(slots);
      }
    },
    groupSlotsByDate(slots) {
      return slots.reduce((acc, slot) => {
        const date = slot.date.split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(slot);
        return acc;
      }, {});
    },
    selectSlot(slot) {
      this.selectedSlot = slot;
    },
    redirectToConfirm() {
      const reservationStore = useReservationStore();
      reservationStore.setReservation({
        title: this.title,
        date: this.selectedSlot.date,
        startTime: this.selectedSlot.startTime,
        endTime: this.selectedSlot.endTime,
        therapistId: this.selectedTherapist.id,
      });
      this.$router.push('/reservations/summary');
    },
  },
});
</script>
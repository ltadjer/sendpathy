<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>New Reservation</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label>Therapist</ion-label>
          <ion-select v-model="selectedTherapist" placeholder="Select Therapist">
            <ion-select-option v-for="therapist in therapists" :key="therapist.id" :value="therapist.id">
              {{ therapist.username }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-accordion-group>
          <ion-accordion v-for="(slots, date) in availableSlotsByDate" :key="date">
            <ion-item slot="header">
              <ion-label>{{ date }}</ion-label>
            </ion-item>
            <ion-list slot="content">
              <ion-radio-group v-model="selectedSlot">
                <ion-item v-for="slot in slots" :key="slot.id">
                  <ion-label>{{ slot.startTime }} - {{ slot.endTime }}</ion-label>
                  <ion-radio slot="start" :value="slot.id"></ion-radio>
                </ion-item>
              </ion-radio-group>
            </ion-list>
          </ion-accordion>
        </ion-accordion-group>
      </ion-list>
      <ion-button expand="full" @click="submitReservation">Submit</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import reservationService from '@/services/reservation.service';
import availableSlotService from '@/services/available-slot.service';
import authService from '@/services/auth.service';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonAccordionGroup, IonAccordion, IonRadioGroup, IonRadio, IonButton } from '@ionic/vue';

export default {
  data() {
    return {
      availableSlotsByDate: {},
      selectedSlot: null,
      therapists: [],
      selectedTherapist: null,
    };
  },
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonAccordionGroup, IonAccordion, IonRadioGroup, IonRadio, IonButton,
  },
  async created() {
    const slots = await availableSlotService.fetchAllAvailableSlots();
    this.availableSlotsByDate = this.groupSlotsByDate(slots);
    this.therapists = await authService.fetchAllTherapists();
  },
  methods: {
    groupSlotsByDate(slots) {
      return slots.reduce((acc, slot) => {
        const date = new Date(slot.startTime).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(slot);
        return acc;
      }, {});
    },
    async submitReservation() {
      if (!this.selectedSlot || !this.selectedTherapist) {
        alert('Please select a slot and a therapist');
        return;
      }
      await reservationService.createOneReservation({
        slotId: this.selectedSlot,
        therapistId: this.selectedTherapist,
      });
      alert('Reservation created successfully');
    },
  },
};
</script>
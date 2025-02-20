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
          <ion-title>Nouvelle réservation</ion-title>
        </ion-item>
        <ion-buttons slot="end">
          <ion-button size="small" class="ion-no-shadow">
            <img alt="Logo" src="@/assets/logo.png" width="50px" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list class="ion-padding">
        <ion-title>
          <h1 class="gradient-text">Échangeons</h1>
        </ion-title>
        <ion-grid>
          <ion-row>
            <ion-col class="ion-text-center">
              <ion-item lines="none">
                <ion-label>Psychologue</ion-label>
                <ion-select class="ion-no-shadow" v-model="selectedTherapist" placeholder="Choisir un psychologue">
                  <ion-select-option v-for="therapist in therapists" :key="therapist.id" :value="therapist.id">
                    {{ therapist.username }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-accordion-group class="ion-shadow-out rounded-accordion">
                <ion-accordion v-for="(slots, date) in availableSlotsByDate" :key="date">
                  <ion-item slot="header" class="ion-no-shadow">
                    <ion-label>{{ date }}</ion-label>
                  </ion-item>
                  <ion-list slot="content">
                    <ion-chip v-for="slot in slots" :key="slot.id" @click="selectSlot(slot)"
                              :class="{ 'ion-shadow-in': selectedSlot === slot.id }">
                      <span class="gradient-text">{{ formatTime(slot.startTime) }}</span>
                    </ion-chip>
                  </ion-list>
                </ion-accordion>
              </ion-accordion-group>
            </ion-col>
          </ion-row>

        </ion-grid>
        <div class="ion-text-center ion-margin-top">
          <custom-button text="Réserver" @click="submitReservation"></custom-button>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import availableSlotService from '@/services/available-slot.service';
import authService from '@/services/auth.service';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonAccordionGroup, IonAccordion, IonRadioGroup, IonRadio, IonButton, IonAvatar, IonButtons, IonChip, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { useReservationStore } from '@/stores/reservation';
import { formatDate, formatTime } from '@/utils/date';
import CustomButton from '@/components/Commun/CustomButton.vue';
import { useAccountStore } from '@/stores/account';

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
    CustomButton,
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonAccordionGroup, IonAccordion, IonRadioGroup, IonRadio, IonButton, IonAvatar, IonButtons, IonChip, IonGrid, IonRow, IonCol
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
  },
  methods: {
    formatDate,
    formatTime,
    groupSlotsByDate(slots) {
      return slots.reduce((acc, slot) => {
        const date = this.formatDate(slot.startTime);
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
      await useReservationStore().createOneReservation({
        slotId: this.selectedSlot,
        therapistId: this.selectedTherapist,
      });
      alert('Reservation created successfully');
    },
    selectSlot(slot) {
      this.selectedSlot = slot.id;
      console.log('Selected slot', slot);
    },
  },
};
</script>
<style scoped>
.rounded-accordion {
  border-radius: 1rem;
}

ion-accordion, ion-accordion ion-item {
  --background: none;
  background-color: transparent;
}
</style>
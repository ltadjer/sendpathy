<template>
  <ion-list class="ion-padding">
    <ion-title>
      <h1 class="gradient-text">Échangeons</h1>
    </ion-title>
    <ion-grid>
      <ion-row>
        <ion-col class="ion-text-center">
          <ion-item lines="none" class="ion-margin-bottom">
            <ion-label>Psychologue</ion-label>
            <ion-select class="ion-no-shadow" v-model="selectedTherapist" placeholder="Choisir un psychologue">
              <ion-select-option v-for="therapist in therapists" :key="therapist.id" :value="therapist.id">
                {{ therapist.firstName }} {{ therapist.lastName }}
              </ion-select-option>
            </ion-select>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-accordion-group class="ion-shadow-out rounded-accordion">
            <ion-accordion class="ion-shadow-out ion-margin-bottom" v-for="(slots, date) in availableSlotsByDate" :key="date">
              <ion-item lines="none" slot="header" class="ion-no-shadow">
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
      <custom-button :text="reservationId ? 'Modifier' : 'Réserver'" @click="submitReservation"></custom-button>
    </div>
  </ion-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonList, IonTitle, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonSelect, IonSelectOption, IonAccordionGroup, IonAccordion, IonChip } from '@ionic/vue';
import CustomButton from '@/components/Commun/CustomButton.vue';
import { useToastStore } from '@/stores/toast';
import { useReservationStore } from '@/stores/reservation';
import { formatDate, formatTime } from '@/utils/date';

export default defineComponent({
  props: {
    availableSlotsByDate: Object,
    selectedSlot: [String, Number],
    therapists: Array,
    selectedTherapist: [String, Number],
    reservationId: [String, Number]
  },
  components: {
    CustomButton,
    IonList, IonTitle, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonSelect, IonSelectOption, IonAccordionGroup, IonAccordion, IonChip
  },
  methods: {
    formatDate,
    formatTime,
    selectSlot(slot) {
      this.$emit('update:selectedSlot', slot.id);
    },
    async submitReservation() {
      if (!this.selectedSlot || !this.selectedTherapist) {
        useToastStore().showToast('Veuillez sélectionner un créneau et un psychologue');
        return;
      }
      if (this.reservationId) {
        await useReservationStore().updateOneReservation(this.reservationId, {
          slotId: this.selectedSlot,
          therapistId: this.selectedTherapist,
        });
        useToastStore().showToast('Réservation modifiée avec succès');
      } else {
        await useReservationStore().createOneReservation({
          slotId: this.selectedSlot,
          therapistId: this.selectedTherapist,
        });
        useToastStore().showToast('Réservation créée avec succès');
      }
      this.$emit('reservation-submitted');
    }
  }
});
</script>

<style scoped>

ion-accordion, ion-accordion ion-item {
  --background: none;
  background-color: transparent;
  border-radius: 1rem;
}
</style>
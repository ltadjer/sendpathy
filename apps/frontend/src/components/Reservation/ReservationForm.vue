<template>
  <ion-list class="ion-padding">
    <ion-list-header>
      <h1 class="gradient-text">Échangeons</h1>
    </ion-list-header>
    <ion-grid>
      <ion-row>
        <ion-col>
          <h4>Choisir le psychologue</h4>
          <ion-item lines="none" class="ion-margin-bottom">
            <ion-label>Psychologue</ion-label>
            <ion-button expand="block" @click="presentAlert">
              {{ selectedTherapistName || 'Choisir un psychologue' }}
              <ion-icon slot="end" :icon="caretDownOutline"></ion-icon>
            </ion-button>
          </ion-item>
        </ion-col>
      </ion-row>

      <ion-row>
        <ion-col>
          <h4>Choisir la date de la consultation</h4>
          <ion-accordion-group class="ion-shadow-out rounded-accordion">
              <ion-accordion
                class="ion-shadow-out ion-margin-bottom"
                v-for="(slots, date, index) in paginatedSlots"
                :key="date"
              >
                <ion-item lines="none" slot="header" class="ion-no-shadow">
                  <ion-label>{{ date }}</ion-label>
                </ion-item>
                <ion-list slot="content">
                  <ion-chip
                    v-for="slot in slots"
                    :key="slot.id"
                    @click="selectSlot(slot)"
                    :class="{ 'ion-shadow-in': selectedSlot === slot.id }"
                  >
                    <span class="gradient-text">{{ formatTime(slot.startTime) }}</span>
                  </ion-chip>
                </ion-list>
              </ion-accordion>
            </ion-accordion-group>

            <div class="ion-text-center ion-margin-top" v-if="hasMoreDates">
              <ion-button expand="block" @click="loadMoreDates">Voir plus de dates</ion-button>
            </div>
        </ion-col>
      </ion-row>
    </ion-grid>

    <div class="ion-text-center ion-margin-top">
      <custom-button :text="reservationId ? 'Modifier' : 'Réserver'" @click="submitReservation"></custom-button>
    </div>

    <ion-alert
      :is-open="isAlertOpen"
      header="Choisir un psychologue"
      :buttons="alertButtons"
      :inputs="alertInputs"
      cssClass="custom-alert"
    @didDismiss="isAlertOpen = false"
    ></ion-alert>

  </ion-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonList, IonListHeader, IonGrid, IonRow, IonCol, IonItem, IonLabel,
  IonButton, IonAccordionGroup, IonAccordion, IonChip, IonAlert, IonIcon
} from '@ionic/vue';
import CustomButton from '@/components/Commun/CustomButton.vue';
import { useToastStore } from '@/stores/toast';
import { useReservationStore } from '@/stores/reservation';
import { formatTime } from '@/utils/date';

import { caretDownOutline } from 'ionicons/icons';

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
    IonList, IonListHeader, IonGrid, IonRow, IonCol, IonItem, IonLabel,
    IonButton, IonAccordionGroup, IonAccordion, IonChip, IonAlert, IonIcon
  },
  data() {
    return {
      itemsPerPage: 4,
      currentPage: 1,
      isAlertOpen: false,
      selectedTherapistName: '',
      alertInputs: [],
      alertButtons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'alert-button',
        },
        {
          text: 'OK',
          cssClass: 'alert-button',
          classCss: 'button-ok',
          handler: (selectedId: string) => {
            this.$emit('update:selectedTherapist', selectedId);
            this.updateTherapistName();
          }
        }
      ]
    };
  },
  setup() {
    return { caretDownOutline };
  },
  watch: {
    selectedTherapist() {
      this.updateTherapistName();
    },
    therapists: {
      immediate: true,
      handler() {
        this.updateAlertInputs();
      }
    }
  },
  computed: {
    paginatedSlots() {
      const dates = Object.keys(this.availableSlotsByDate);
      const start = 0;
      const end = this.currentPage * this.itemsPerPage;
      const paginatedDates = dates.slice(start, end);

      return paginatedDates.reduce((result, date) => {
        result[date] = this.availableSlotsByDate[date];
        return result;
      }, {});
    },
    hasMoreDates() {
      return (
        Object.keys(this.availableSlotsByDate).length >
        this.currentPage * this.itemsPerPage
      );
    },
  },
  methods: {
    presentAlert() {
      this.isAlertOpen = true;
    },
    updateTherapistName() {
      const therapist = this.therapists?.find(t => t.id === this.selectedTherapist);
      this.selectedTherapistName = therapist ? `${therapist.firstName} ${therapist.lastName}` : '';
    },
    updateAlertInputs() {
      this.alertInputs = this.therapists?.map(therapist => ({
        label: `${therapist.firstName} ${therapist.lastName}`,
        type: 'radio',
        value: therapist.id
      })) || [];
    },
    formatTime,
    selectSlot(slot) {
      this.$emit('update:selectedSlot', slot.id);
    },
    loadMoreDates() {
      this.currentPage++;
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
        await useReservationStore().fetchAllReservations();
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
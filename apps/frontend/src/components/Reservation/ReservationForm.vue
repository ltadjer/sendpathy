<template>
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
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { IonHeader, IonToolbar, IonItem, IonAvatar, IonButton, IonButtons, IonTitle, IonLabel,
  IonRadioGroup,
  IonContent,
  IonAccordionGroup,
  IonRadio, IonAccordion, IonSelectOption,
  IonList, IonSelect,
} from '@ionic/vue'
export default defineComponent({
  name: 'ReservationForm',
  components: {
    IonLabel,
    IonRadioGroup,
    IonContent,
    IonAccordionGroup,
    IonRadio, IonAccordion, IonSelectOption,
    IonList, IonSelect, IonHeader, IonToolbar, IonItem, IonAvatar, IonButton, IonButtons, IonTitle },
  props: {
    currentUser: {
      type: Object,
      required: true
    },
    reservation: {
      type: Object,
      required: true
    }
  }
});
</script>
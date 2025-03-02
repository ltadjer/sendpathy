<template>
  <ion-header :translucent="true" class="ion-padding header-page">
    <ion-toolbar>
      <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
        <div class="avatar-container">
          <ion-avatar slot="start">
            <img alt="User Avatar" :src="currentUser?.avatar" />
          </ion-avatar>
        </div>
        <ion-title>Réservations</ion-title>
      </ion-item>
      <ion-buttons slot="end">
        <ion-button size="small" class="ion-no-shadow">
          <img alt="Logo" src="@/assets/logo.png" width="50px" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
      <ion-segment v-model="selectedSegment" class="ion-padding">
        <ion-segment-button value="upcoming" :class="{'ion-shadow-in': selectedSegment === 'upcoming'}">
          <ion-label><span :class="{'gradient-text': selectedSegment === 'upcoming'}">A venir</span></ion-label>
        </ion-segment-button>
        <ion-segment-button value="past" :class="{'ion-shadow-in': selectedSegment === 'past'}">
          <ion-label><span :class="{'gradient-text': selectedSegment === 'past'}">Passées</span></ion-label>
        </ion-segment-button>
      </ion-segment>

    <ion-list class="ion-padding-start ion-padding-end">
      <ion-card v-for="reservation in filteredReservations" :key="reservation.id" class="reservation-card">
        <ion-card-header>
          <ion-card-title> Dr {{ getTherapistName(reservation.slot.therapistId) }}
            <ion-icon class="custom-icon" :icon="enterOutline">
              <a v-if="reservation.videoCallLink" :href="reservation.videoCallLink" target="_blank">Rejoindre la visioconférence</a>
            </ion-icon></ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row class="ion-padding-start ion-padding-end">
              <ion-col size="6">
                <ion-card-subtitle>Service</ion-card-subtitle>
                <ion-card-title>Psychologue</ion-card-title>
              </ion-col>
            </ion-row>
            <ion-row class="ion-padding-start ion-padding-end">
              <ion-col size="6">
                <ion-card-subtitle>Date</ion-card-subtitle>
                <ion-card-title>{{ formatDate(reservation.slot.startTime) }}</ion-card-title>
              </ion-col>
              <ion-col size="6">
                <ion-card-subtitle>Heure</ion-card-subtitle>
                <ion-card-title>{{ formatTime(reservation.slot.startTime) }} - {{ formatTime(reservation.slot.endTime) }}</ion-card-title>
              </ion-col>
            </ion-row>
          </ion-grid>
          <ion-grid>
            <ion-row>
              <ion-col size="6">
                <ion-button expand="block" fill="clear" class="ion-no-shadow"> <span class="gradient-text">Déplacer le RDV </span></ion-button>
              </ion-col>
              <ion-col size="6">
                <ion-button expand="block" fill="clear" class="ion-no-shadow"><span class="gradient-text">Annuler le RDV</span></ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-list>
  </ion-content>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonAvatar, IonButtons, IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonCardContent, IonCardHeader, IonGrid, IonRow, IonCol, IonIcon, IonSegment, IonSegmentButton } from '@ionic/vue';
import { enterOutline } from 'ionicons/icons';
import { formatTime } from '@/utils/date';

export default defineComponent({
  name: 'ReservationList',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonAvatar, IonButtons, IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonCardContent, IonCardHeader, IonGrid, IonRow, IonCol, IonIcon, IonSegment, IonSegmentButton },

  props: {
    currentUser: {
      type: Object,
      required: true
    },
    reservations: {
      type: Array,
      required: true
    },
    therapists: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      selectedSegment: 'upcoming', // Valeur par défaut (A venir)
    };
  },

  computed: {
    // Filtrage des réservations en fonction de la sélection du segment
    filteredReservations() {
      if (!this.reservations) return []; // Si reservations est undefined, on retourne un tableau vide.

      const currentDate = new Date();
      return this.reservations.filter(reservation => {
        const reservationDate = new Date(reservation.slot.startTime);
        if (this.selectedSegment === 'upcoming') {
          return reservationDate >= currentDate; // Réservations à venir
        } else {
          return reservationDate < currentDate; // Réservations passées
        }
      });
    }
  },
  setup() {
    return { enterOutline };
  },
  methods: {
    formatTime,
    formatDate(date: string) {
      return new Date(date).toLocaleDateString();
    },
    getTherapistName(therapistId: string) {
      const therapist = this.therapists?.find(t => t.id === therapistId);
      return therapist ? `${therapist.firstName} ${therapist.lastName}` : 'Unknown Therapist';
    }
  }
});
</script>

<style scoped>
ion-card {
  margin: 0;
  margin-bottom: 1rem;
}

ion-card-title {
  --color: #333 !important;
}

ion-card-content,
ion-grid {
  padding: 0;
}
ion-row ion-card-title {
  font-size: 1rem;
}

ion-card-header ion-card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>

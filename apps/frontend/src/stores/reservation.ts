import { defineStore } from 'pinia';

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    reservation: {
      date: '',
      time: '',
    },
    therapist: {
      name: '',
      description: '',
      image: '',
    },
  }),
  actions: {
    setReservation(reservation) {
      this.reservation = reservation;
    },
    setTherapist(therapist) {
      this.therapist = therapist;
    }
  },
});
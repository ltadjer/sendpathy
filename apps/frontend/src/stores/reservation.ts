import { defineStore } from 'pinia';
import ReservationService from '@/services/reservation.service';
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
    },
    async fetchAllReservations() {
      try {
        this.reservations = await ReservationService.fetchAllReservations();
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      }
    },

    async fetchOneReservationById(reservationId) {
      try {
        return await ReservationService.fetchOneReservationById(reservationId);
      } catch (error) {
        console.error('Failed to fetch reservation:', error);
      }
    },

    async createOneReservation(reservationData) {
      try {
        const newReservation = await ReservationService.createOneReservation(reservationData);
        this.reservations.push(newReservation);
      } catch (error) {
        console.error('Failed to create reservation:', error);
      }
    },

    async updateOneReservation(reservationId, reservationData) {
      try {
        const updatedReservation = await ReservationService.updateOneReservation(reservationId, reservationData);
        const index = this.reservations.findIndex((l) => l.id === reservationId);
        this.reservations[index] = updatedReservation;
      } catch (error) {
        console.error('Failed to update reservation:', error);
      }
    },

    async deleteOneReservation(reservationId) {
      try {
        await ReservationService.deleteOneReservation(reservationId);
        this.reservations = this.reservations.filter((l) => l.id !== reservationId);
      } catch (error) {
        console.error('Failed to delete reservation:', error);
      }
    },
  },
});
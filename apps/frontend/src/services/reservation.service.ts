import api from './api.service';

export default {
  /**
   * Fetch all reservations for the logged-in user.
   */
  async fetchAllReservations() {
    try {
      const response = await api.get('/reservations');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  },

  /**
   * Fetch a single reservation by its ID.
   *
   * @param {string} reservationId The ID of the reservation to fetch.
   */
  async fetchOneReservationById(reservationId) {
    try {
      const response = await api.get(`/reservations/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch reservation:', error);
    }
  },

  /**
   * Create a new reservation.
   *
   * @param {object} reservationData The data for the new reservation.
   */
  async createOneReservation(reservationData) {
    try {
      const response = await api.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      console.error('Failed to create reservation:', error);
    }
  },

  /**
   * Update an existing reservation.
   *
   * @param {string} reservationId The ID of the reservation to update.
   * @param {object} reservationData The new data for the reservation.
   */
  async updateOneReservation(reservationId, reservationData) {
    try {
      const response = await api.patch(`/reservations/${reservationId}`, reservationData);
      return response.data;
    } catch (error) {
      console.error('Failed to update reservation:', error);
    }
  },

  /**
   * Delete an existing reservation.
   *
   * @param {string} reservationId The ID of the reservation to delete.
   */
  async deleteOneReservation(reservationId) {
    try {
      await api.delete(`/reservations/${reservationId}`);
    } catch (error) {
      console.error('Failed to delete reservation:', error);
    }
  },




}
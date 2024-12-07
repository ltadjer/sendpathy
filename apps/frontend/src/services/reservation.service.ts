import api from './api.service';

export default {
  /**
   * Fetch all reservations for the logged-in user.
   */
  async fetchAllReservations() {
    const response = await api.get('/reservations');
    return response.data;
  },

  /**
   * Fetch a single reservation by its ID.
   *
   * @param {string} reservationId The ID of the reservation to fetch.
   */
  async fetchOneReservationById(reservationId) {
    const response = await api.get(`/reservations/${reservationId}`);
    return response.data;
  },

  /**
   * Create a new reservation.
   *
   * @param {object} reservationData The data for the new reservation.
   */
  async createOneReservation(reservationData) {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  /**
   * Update an existing reservation.
   *
   * @param {string} reservationId The ID of the reservation to update.
   * @param {object} reservationData The new data for the reservation.
   */
  async updateOneReservation(reservationId, reservationData) {
    const response = await api.patch(`/reservations/${reservationId}`, reservationData);
    return response.data;
  },

  /**
   * Delete an existing reservation.
   *
   * @param {string} reservationId The ID of the reservation to delete.
   */
  async deleteOneReservation(reservationId) {
    const response = await api.delete(`/reservations/${reservationId}`);
    return response.data;
  },



}
import { defineStore } from 'pinia';
import lifeMomentService from '@/services/lifeMoment.service';

export const useLifeMomentStore = defineStore('lifeMoment', {
  state: () => ({
    lifeMoments: [] as Array<any>,
  }),
  actions: {
    async fetchLifeMoments() {
      try {
        this.lifeMoments = await lifeMomentService.fetchAllLifeMoments();
        console.log('Life moments:', this.lifeMoments);
      } catch (error) {
        console.error('Failed to fetch life moments:', error);
      }
    },
    async addLifeMoment(lifeMoment: any) {
      try {
        // créer un life moment
        const newLifeMoment = await lifeMomentService.createOneLifeMoment(lifeMoment);
        // mettre à jour la liste des life moments du store
        this.lifeMoments.push(newLifeMoment);
      } catch (error) {
        console.error('Failed to add life moment:', error);
      }
    },
    async updateLifeMoment(id: string, lifeMoment: any) {
      const updatedLifeMoment = await lifeMomentService.updateOneLifeMoment(id, lifeMoment);
      // mettre à jour la liste des life moments du store
      const index = this.lifeMoments.findIndex((l) => l.id === id);
      this.lifeMoments[index] = updatedLifeMoment;
    },
    async deleteLifeMoment(id: string) {
      await lifeMomentService.deleteOneLifeMoment(id);
      // mettre à jour la liste des life moments du store
      this.lifeMoments = this.lifeMoments.filter((l) => l.id !== id);
    },
  },
});
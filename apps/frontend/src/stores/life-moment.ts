import { defineStore } from 'pinia';
import lifeMomentService from '@/services/life-moment.service';

export const useLifeMomentStore = defineStore('lifeMoment', {
  state: () => ({
    lifeMoments: [] as Array<any>,
  }),
  actions: {
    async fetchLifeMoments() {
      try {
        this.lifeMoments = await lifeMomentService.fetchAllLifeMoments();
      } catch (error) {
        console.error('Failed to fetch life moments:', error);
      }
    },
    async fetchOneLifeMomentById(id: string) {
      try {
        const updatedLifeMoment = await lifeMomentService.fetchOneLifeMomentById(id);
        // mettre à jour la liste des life moments du store
        const index = this.lifeMoments.findIndex((l) => l.id === id);
        this.lifeMoments[index] = updatedLifeMoment;
        return updatedLifeMoment;
      } catch (error) {
        console.error('Failed to fetch life moment:', error);
      }
    },
    async createOneLifeMoment(lifeMoment: any) {
      try {
        // créer un life moment
        const newLifeMoment = await lifeMomentService.createOneLifeMoment(lifeMoment);
        // mettre à jour la liste des life moments du store
        this.lifeMoments.push(newLifeMoment);
      } catch (error) {
        console.error('Failed to add life moment:', error);
      }
    },
    async updateOneLifeMoment(id: string, lifeMoment: any) {
      const updatedLifeMoment = await lifeMomentService.updateOneLifeMoment(id, lifeMoment);
      // mettre à jour la liste des life moments du store
      const index = this.lifeMoments.findIndex((l) => l.id === id);
      this.lifeMoments[index] = updatedLifeMoment;
    },
    async deleteOneLifeMoment(id: string) {
      await lifeMomentService.deleteOneLifeMoment(id);
      // mettre à jour la liste des life moments du store
      this.lifeMoments = this.lifeMoments.filter((l) => l.id !== id);
    },

    async deleteOneContent(contentId: string) {
      await lifeMomentService.deleteOneContent(contentId);
    }
  },
});
import { defineStore } from 'pinia';
import TriggerService from '@/services/trigger.service';

export const useTriggerStore = defineStore('trigger', {
  state: () => ({
    triggers: [] as Array<any>,
  }),
  actions: {
    async fetchAllTriggers() {
      try {
        this.triggers = await TriggerService.fetchAllTriggers();
      } catch (error) {
        console.error('Failed to fetch triggers:', error);
      }
    },
  },
});
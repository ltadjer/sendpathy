import { defineStore } from 'pinia';
import TagService from '@/services/tag.service';

export const useTagStore = defineStore('tag', {
  state: () => ({
    tags: [] as Array<any>,
  }),
  actions: {
    async fetchAllTags() {
      try {
        this.tags = await TagService.fetchAllTags();
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    },
  },
});
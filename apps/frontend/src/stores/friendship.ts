import { defineStore } from 'pinia';
import friendshipService from '@/services/friendship.service';

export const useFriendshipStore = defineStore('friendship', {
  state: () => ({
    friendships: [] as Array<any>,
  }),
  actions: {
    async fetchAllFriendships() {
      try {
        this.friendships = await friendshipService.fetchAllFriendships();
      } catch (error) {
        console.error('Failed to fetch friendships:', error);
      }
    },
    async createOneFriendship(friendship: any) {
      try {
        const newFriendship = await friendshipService.createOneFriendship(friendship);
        this.friendships.push(newFriendship);
      } catch (error) {
        console.error('Failed to add friendship:', error);
      }
    },
    async deleteOneFriendship(id: string) {
      await friendshipService.deleteOneFriendship(id);
      this.friendships = this.friendships.filter((l) => l.id !== id);
    },
    async acceptFriendship(id: string) {
      try {
        const updatedFriendship = await friendshipService.acceptFriendship(id);
        const index = this.friendships.findIndex(f => f.id === id);
        if (index !== -1) {
          this.friendships[index] = updatedFriendship;
        }
      } catch (error) {
        console.error('Failed to accept friendship:', error);
      }
    },
  },
});
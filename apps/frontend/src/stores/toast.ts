import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    isOpen: false,
    message: '',
    color: 'primary',
  }),
  actions: {
    showToast(message: string, color: string = 'primary') {
      this.message = message;
      this.color = color;
      this.isOpen = true;
    },
    hideToast() {
      this.isOpen = false;
    },
    resetToast() {
      this.message = '';
    }
  },
});
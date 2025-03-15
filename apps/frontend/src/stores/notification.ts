import { defineStore } from 'pinia';
import notificationService from '@/services/notification.service';
import NotificationWebSocketService from '@/services/notification-websocket.service';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
  }),
  actions: {
    async fetchAllNotifications() {
      this.notifications = await notificationService.fetchAllNotifications();
    },
    async markAsRead(notificationId: string) {
      await notificationService.markAsRead(notificationId);
      this.notifications = this.notifications.filter(n => n.id !== notificationId);
    },
    async updateNotificationMessage(notificationId: string, message: string) {
      await notificationService.updateNotificationMessage(notificationId, message);
    },
    addNotification(notification) {
      this.notifications.push(notification);
    },
  },
  created() {
    NotificationWebSocketService.on('newNotification', this.addNotification);
  },
});
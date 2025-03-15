import { io, Socket } from 'socket.io-client';
import { useNotificationStore } from '@/stores/notification';

class NotificationWebSocketService {
  public socket: Socket;

  constructor() {
    this.socket = io('https://api.sendpathy.aaa/notifications', {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.warn('WebSocket disconnected');
    });

    this.socket.on('exception', (error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('newNotification', (notification) => {
      console.log('New notification:', notification);
      const notificationStore = useNotificationStore();
      notificationStore.addNotification(notification);
    });
  }

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void) {
    this.socket.off(event, callback);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export default new NotificationWebSocketService();
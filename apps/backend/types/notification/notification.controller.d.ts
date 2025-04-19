import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    fetchAll(user: any): Promise<any>;
    markAsRead(id: string): Promise<any>;
    updateNotificationMessage(id: string, message: string): Promise<any>;
}

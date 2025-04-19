import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType } from '@prisma/client';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    createNotification(receiverId: string, type: NotificationType, message: string, senderId: string): Promise<any>;
    fetchAllNotifications(receiverId: string): Promise<any>;
    markAsRead(notificationId: string): Promise<any>;
    updateNotificationMessage(notificationId: string, message: string): Promise<any>;
}

import { Server } from 'socket.io';
import { NotificationService } from './notification.service';
import { CustomSocket } from '../message/dto/custom-socket';
import { NotificationType } from '@prisma/client';
export declare class NotificationGateway {
    private readonly notificationService;
    server: Server;
    constructor(notificationService: NotificationService);
    handleSendNotification(client: CustomSocket, payload: any): Promise<void>;
    sendNotificationToUser(receiverId: string, type: NotificationType, message: string, senderId: string): Promise<void>;
}

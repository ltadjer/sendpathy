import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationService } from './notification.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UseGuards } from '@nestjs/common';
import { CustomSocket } from '../message/dto/custom-socket.js';
import { NotificationType } from '@prisma/client';

@WebSocketGateway({ namespace: 'notifications' })
@UseGuards(JwtAuthGuard)
export class NotificationGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly notificationService: NotificationService) {}

  @SubscribeMessage('sendNotification')
  async handleSendNotification(@ConnectedSocket() client: CustomSocket, @MessageBody() payload: any) {
    const notification = await this.notificationService.createNotification(payload.receiverId, payload.type, payload.message, payload.senderId);
    this.server.emit('newNotification', notification);
  }

  async sendNotificationToUser(receiverId: string, type: NotificationType, message: string, senderId: string) {
    const notification = await this.notificationService.createNotification(receiverId, type, message, senderId);
    this.server.emit('newNotification', notification);
  }
}
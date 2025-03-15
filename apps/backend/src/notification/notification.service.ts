import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(receiverId: string, type: NotificationType, message: string, senderId: string) {
    return await this.prisma.notification.create({
      data: {
        receiverId,
        type,
        message,
        senderId,
      },
      include: { receiver: true, sender: true },
    });
  }

  async fetchAllNotifications(receiverId: string) {
    return await this.prisma.notification.findMany({
      where: { receiverId },
      orderBy: { createdAt: 'desc' },
      include: { receiver: true, sender: true },
    });
  }

  async markAsRead(notificationId: string) {
    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
      include: { receiver: true, sender: true },
    });
  }

  async updateNotificationMessage(notificationId: string, message: string) {
    return await this.prisma.notification.update({
      where: { id: notificationId },
      data: { message },
      include: { receiver: true, sender: true },
    });
  }
}
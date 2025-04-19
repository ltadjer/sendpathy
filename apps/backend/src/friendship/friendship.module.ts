import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service.js';
import { FriendshipController } from './friendship.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationModule } from '../notification/notification.module.js';

@Module({
  imports: [NotificationModule],
  providers: [FriendshipService, PrismaService],
  controllers: [FriendshipController],
})
export class FriendshipModule {}
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { NotificationGateway } from './notification.gateway.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotificationController } from './notification.controller.js'

@Module({
  imports: [PrismaModule],
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService, NotificationGateway],
  controllers: [NotificationController],
})
export class NotificationModule {}
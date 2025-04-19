import { Module } from '@nestjs/common';
import { MessageService } from './message.service.js';
import { MessageController } from './message.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MessageGateway } from './message.gateway.js';
import { ConversationService } from '../conversation/conversation.service.js'

@Module({
  providers: [MessageService, PrismaService, MessageGateway, ConversationService],
  controllers: [MessageController],
  imports: [PrismaModule],
  exports: [MessageService],
})
export class MessageModule {}
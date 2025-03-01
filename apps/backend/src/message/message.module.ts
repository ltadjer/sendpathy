import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { MessageGateway } from './message.gateway';
import { ConversationService } from '../conversation/conversation.service'

@Module({
  providers: [MessageService, PrismaService, MessageGateway, ConversationService],
  controllers: [MessageController],
  imports: [PrismaModule],
  exports: [MessageService],
})
export class MessageModule {}
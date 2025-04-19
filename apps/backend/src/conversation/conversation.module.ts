import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller.js';
import {PrismaModule} from "../prisma/prisma.module.js";
import { ConversationService } from './conversation.service.js';
import {MessageModule} from "../message/message.module.js";
@Module({
  providers: [ConversationService],
  controllers: [ConversationController],
  imports: [PrismaModule, MessageModule],

})
export class ConversationModule {}

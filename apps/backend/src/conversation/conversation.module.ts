import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import {PrismaModule} from "../prisma/prisma.module";
import { ConversationService } from './conversation.service';
import {MessageModule} from "../message/message.module";
@Module({
  providers: [ConversationService],
  controllers: [ConversationController],
  imports: [PrismaModule, MessageModule],

})
export class ConversationModule {}

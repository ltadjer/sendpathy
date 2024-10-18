import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsModule } from '../events/events.module';
@Module({
  providers: [MessageService],
  controllers: [MessageController],
  imports: [PrismaModule, EventsModule],
  exports: [MessageService],
})
export class MessageModule {}

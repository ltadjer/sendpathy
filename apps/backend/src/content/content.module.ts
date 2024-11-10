import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
  imports: [PrismaModule],
})
export class ContentModule {}

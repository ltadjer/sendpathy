import { Module } from '@nestjs/common';
import { ContentController } from './content.controller.js';
import { ContentService } from './content.service.js';
import { PrismaModule } from '../prisma/prisma.module.js'

@Module({
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
  imports: [PrismaModule],
})
export class ContentModule {}

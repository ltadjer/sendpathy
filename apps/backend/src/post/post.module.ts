import { Module } from '@nestjs/common';
import { PostController } from './post.controller.js';
import { PostService } from './post.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [PrismaModule],
})
export class PostModule {}

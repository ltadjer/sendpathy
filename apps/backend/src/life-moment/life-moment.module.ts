import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LifeMomentService } from './life-moment.service.js';
import { LifeMomentController } from './life-moment.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js'
import { ContentModule } from '../content/content.module.js'
import { CodeAuthMiddleware } from './middleware/code-auth.middleware.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [LifeMomentService],
  controllers: [LifeMomentController],
  imports: [
    PrismaModule,
    ContentModule,
  ],
})
export class LifeMomentModule {}

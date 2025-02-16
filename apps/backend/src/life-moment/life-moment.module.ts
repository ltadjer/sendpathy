import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LifeMomentService } from './life-moment.service';
import { LifeMomentController } from './life-moment.controller';
import { PrismaModule } from '../prisma/prisma.module'
import { ContentModule } from '../content/content.module'
import { CodeAuthMiddleware } from './middleware/code-auth.middleware';
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

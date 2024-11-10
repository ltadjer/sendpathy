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
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
})
export class LifeMomentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CodeAuthMiddleware)
      .forRoutes({ path: 'life-moments', method: RequestMethod.ALL });
  }
}

import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserService } from '../user/user.service.js';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { MailerModule } from '../mailer/mailer.module.js';
import { UserModule } from '../user/user.module.js';
import { CodeAuthMiddleware } from '../life-moment/middleware/code-auth.middleware.js';
import cookieParser from 'cookie-parser';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, PrismaService, UserService, CodeAuthMiddleware],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
    UserModule,
    MailerModule,
   ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
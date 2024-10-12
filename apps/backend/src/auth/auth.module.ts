import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module'; 
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailerModule } from 'src/mailer/mailer.module';
import { UserModule } from 'src/user/user.module';


@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, PrismaService, UserService],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    PrismaModule,
    UserModule,
    MailerModule,
   ],
})
export class AuthModule {}

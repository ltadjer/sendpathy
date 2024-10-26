import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailerModule } from './mailer/mailer.module';
import { PostModule } from './post/post.module';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { FriendshipModule } from './friendship/friendship.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, MailerModule, PostModule, MessageModule, ConversationModule, FriendshipModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
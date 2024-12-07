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
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { CommentModule } from './comment/comment.module';
import { LikeController } from './like/like.controller';
import { LikeService } from './like/like.service';
import { LikeModule } from './like/like.module';
import { TriggerController } from './trigger/trigger.controller';
import { TriggerService } from './trigger/trigger.service';
import { TriggerModule } from './trigger/trigger.module';
import { TagController } from './tag/tag.controller';
import { TagService } from './tag/tag.service';
import { TagModule } from './tag/tag.module';
import { LifeMomentModule } from './life-moment/life-moment.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, MailerModule, PostModule, MessageModule, ConversationModule, FriendshipModule, CommentModule, LikeModule, TriggerModule, TagModule, LifeMomentModule, ContentModule],
  controllers: [AppController, CommentController, LikeController, TriggerController, TagController],
  providers: [AppService, CommentService, LikeService, TriggerService, TagService],
})
export class AppModule {}
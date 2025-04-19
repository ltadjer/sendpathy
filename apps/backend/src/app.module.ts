import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { MailerModule } from './mailer/mailer.module.js';
import { MessageModule } from './message/message.module.js';
import { ConversationModule } from './conversation/conversation.module.js';
import { FriendshipModule } from './friendship/friendship.module.js';
import { CommentModule } from './comment/comment.module.js';
import { LifeMomentModule } from './life-moment/life-moment.module.js';
import { ContentModule } from './content/content.module.js';
import { ReservationModule } from './reservation/reservation.module.js';
import { NotificationModule } from './notification/notification.module.js';
import { PrismaService } from './prisma/prisma.service.js';
import { UserService } from './user/user.service.js';
import { CommentService } from './comment/comment.service.js';
import { LikeService } from './like/like.service.js';
import { TriggerService } from './trigger/trigger.service.js';
import { TagService } from './tag/tag.service.js';
import { ReservationService } from './reservation/reservation.service.js';
import { NotificationService } from './notification/notification.service.js';
import { CommentController } from './comment/comment.controller.js';
import { LikeController } from './like/like.controller.js';
import { TriggerController } from './trigger/trigger.controller.js';
import { TagController } from './tag/tag.controller.js';
import { ReservationController } from './reservation/reservation.controller.js';
import { AvailableSlotController } from './available-slot/available-slot.controller.js';
import { NotificationController } from './notification/notification.controller.js';
import { AvailableSlotService } from './available-slot/available-slot.service.js';
import { PostModule } from './post/post.module.js';
import { TagModule } from './tag/tag.module.js';
import { LikeModule} from './like/like.module.js';
import { AdminModule } from './admin/admin.module.js';
import { TriggerModule } from './trigger/trigger.module.js';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    MailerModule,
    PostModule,
    MessageModule,
    ConversationModule,
    FriendshipModule,
    CommentModule,
    LikeModule,
    TriggerModule,
    TagModule,
    LifeMomentModule,
    ContentModule,
    ReservationModule,
    NotificationModule,
    AdminModule,
  ],
  controllers: [
    AppController,
    CommentController,
    LikeController,
    TriggerController,
    TagController,
    ReservationController,
    AvailableSlotController,
    NotificationController,
  ],
  providers: [
    AppService,
    CommentService,
    LikeService,
    TriggerService,
    TagService,
    ReservationService,
    AvailableSlotService,
    NotificationService,
    PrismaService,
    UserService,
  ],
})
export class AppModule {}
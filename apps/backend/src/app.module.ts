import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailerModule } from './mailer/mailer.module';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { FriendshipModule } from './friendship/friendship.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { TriggerModule } from './trigger/trigger.module';
import { TagModule } from './tag/tag.module';
import { LifeMomentModule } from './life-moment/life-moment.module';
import { ContentModule } from './content/content.module';
import { ReservationModule } from './reservation/reservation.module';
import { NotificationModule } from './notification/notification.module';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { CommentService } from './comment/comment.service';
import { LikeService } from './like/like.service';
import { TriggerService } from './trigger/trigger.service';
import { TagService } from './tag/tag.service';
import { ReservationService } from './reservation/reservation.service';
import { NotificationService } from './notification/notification.service';
import { CommentController } from './comment/comment.controller';
import { LikeController } from './like/like.controller';
import { TriggerController } from './trigger/trigger.controller';
import { TagController } from './tag/tag.controller';
import { ReservationController } from './reservation/reservation.controller';
import { AvailableSlotController } from './available-slot/available-slot.controller';
import { NotificationController } from './notification/notification.controller';
import { AvailableSlotService } from './available-slot/available-slot.service';
import { PostModule } from './post/post.module';
import * as bcrypt from 'bcrypt';

const authenticate = async (email: string, password: string, userService: UserService) => {
  const user = await userService.findOneByEmail(email);

  if (user && await bcrypt.compare(password, user.password) && user.role === 'THERAPIST') {
    return user;
  }

  return null;
};

@Module({
  imports: [
    AuthModule,
    UserModule, // Ensure UserModule is explicitly imported
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
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        imports: [UserModule], // Add this line
        useFactory: (userService: UserService) => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [],
          },
          auth: {
            authenticate: (email: string, password: string) => authenticate(email, password, userService),
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        }),
        inject: [UserService],
      })
    ),
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
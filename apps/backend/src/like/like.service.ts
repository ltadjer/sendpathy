import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationGateway } from '../notification/notification.gateway.js';
import { NotificationType } from '@prisma/client';

@Injectable()
export class LikeService {
  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationGateway,
  ) {}

  async likePost(postId: string, userId: string) {
    if (await this.prisma.like.findFirst({ where: { postId, userId } })) {
      return { message: 'Post already liked' };
    }
    const like = await this.prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    const post = await this.prisma.post.findUnique({ where: { id: postId }, include: { user: true } });
    if (post.userId !== userId) {
      const message = `${post.user.username} a aimé votre post`;
      await this.notificationGateway.sendNotificationToUser(post.userId, NotificationType.LIKE, message, userId);
    }

    return { message: 'Post liked', postId };
  }

  async unlikePost(postId: string, userId: string) {
    await this.prisma.like.deleteMany({ where: { postId, userId } });
    return { message: 'Post unliked', postId };
  }

  async likeComment(commentId: string, userId: string) {
    if (await this.prisma.like.findFirst({ where: { commentId, userId } })) {
      return { message: 'Comment already liked' };
    }
    const like = await this.prisma.like.create({
      data: {
        comment: { connect: { id: commentId } },
        user: { connect: { id: userId } },
      },
    });

    const comment = await this.prisma.comment.findUnique({ where: { id: commentId }, include: { user: true } });
    if (comment.userId !== userId) {
      const message = `${comment.user.username} a aimé votre commentaire`;
      await this.notificationGateway.sendNotificationToUser(comment.userId, NotificationType.LIKE, message, userId);
    }

    return { message: 'Comment liked', commentId };
  }

  async unlikeComment(commentId: string, userId: string) {
    await this.prisma.like.deleteMany({ where: { commentId, userId } });
    return { message: 'Comment unliked', commentId };
  }
}
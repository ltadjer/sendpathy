import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async likePost(postId: string, userId: string) {
    // si l'user n'a pas déjà liké le post
    if(await this.prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    })) {
      return { message: 'Post already liked' };
    }
    await this.prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });
    return { message: 'Post liked', postId: postId };
  }

  async unlikePost(postId: string, userId: string) {
    await this.prisma.like.deleteMany({
      where: {
        postId: postId,
        userId: userId,
      },
    });
    return { message: 'Post unliked', postId: postId };
  }

  async likeComment(commentId: string, userId: string) {
    if(await this.prisma.like.findFirst({
      where: {
        commentId: commentId,
        userId: userId,
      },
    })) {
      return { message: 'Comment already liked' };
    }
    await this.prisma.like.create({
      data: {
        comment: { connect: { id: commentId } },
        user: { connect: { id: userId } },
      },
    });
    return { message: 'Comment liked', commentId: commentId };
  }

  async unlikeComment(commentId: string, userId: string) {
    await this.prisma.like.deleteMany({
      where: {
        commentId: commentId,
        userId: userId,
      },
    });
    return { message: 'Comment unliked', commentId: commentId };
  }
}

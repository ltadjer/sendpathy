import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.like.findUnique({
      where: { id: id }
    })
  }

  async findAll() {
    return this.prisma.like.findMany();
  }

  async likePost(postId: string, userId: string) {
    return this.prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async unlikePost(postId: string, userId: string) {
    await this.prisma.like.deleteMany({
      where: {
        postId: postId,
        userId: userId,
      },
    });
    return { message: 'Post unliked' };
  }

  async countPostLikes(postId: string) {
    return this.prisma.like.count({
      where: {
        postId: postId,
      },
    });
  }

  async likeComment(commentId: string, userId: string) {
    return this.prisma.like.create({
      data: {
        comment: { connect: { id: commentId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async unlikeComment(commentId: string, userId: string) {
    await this.prisma.like.deleteMany({
      where: {
        commentId: commentId,
        userId: userId,
      },
    });
    return { message: 'Comment unliked' };
  }

  async countCommentLikes(commentId: string) {
    return this.prisma.like.count({
      where: {
        commentId: commentId,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.comment.findUnique({
      where: { id: id }
    })
  }

  async findAll() {
    return this.prisma.comment.findMany();
  }


  async addCommentToPost(postId: string, createCommentDto: any, userId: string) {
    // Check if the post exists
    const postExists = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!postExists) {
      throw new Error('Post not found');
    }

    // Create the comment if the post exists
    return this.prisma.comment.create({
      data: {
        ...createCommentDto,
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async addCommentToComment(parentCommentId: string, createCommentDto: any, userId: string) {
    // Retrieve the parent comment to get the associated post ID
    const parentComment = await this.prisma.comment.findUnique({
      where: { id: parentCommentId },
      include: { post: true },
    });

    if (!parentComment) {
      throw new Error('Parent comment not found');
    }

    // Create the comment with the associated post ID
    return this.prisma.comment.create({
      data: {
        ...createCommentDto,
        parent: { connect: { id: parentCommentId } },
        user: { connect: { id: userId } },
        post: { connect: { id: parentComment.postId } },
      },
    });
  }

  async removeCommentFromPost(postId: string, commentId: string) {
    // Check if the post exists
    const postExists = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!postExists) {
      throw new Error('Post not found');
    }

    await this.deleteCommentAndReplies(this.prisma, commentId);

    return { message: 'Comment and its replies deleted for the post' };
  }

  async removeCommentFromComment(parentCommentId: string, commentId: string) {
    // Check if the parent comment exists
    const parentCommentExists = await this.prisma.comment.findUnique({
      where: { id: parentCommentId },
    });

    if (!parentCommentExists) {
      throw new Error('Parent comment not found');
    }

    await this.deleteCommentAndReplies(this.prisma, commentId);

    return { message: 'Comment and its replies deleted for the comment' };
  }

  async deleteCommentAndReplies(prisma: PrismaService, commentId: string) {
    // Check if the comment exists
    const commentExists = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!commentExists) {
      throw new Error('Comment not found');
    }

    // Recursive function to delete a comment and its replies
    const recursiveDelete = async (id: string) => {
      const replies = await prisma.comment.findMany({
        where: { parentId: id },
      });

      for (const reply of replies) {
        await recursiveDelete(reply.id);
      }

      await prisma.comment.delete({
        where: { id: id },
      });
    };

    // Delete the comment and its replies
    await recursiveDelete(commentId);
  }
}

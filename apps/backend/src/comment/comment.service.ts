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

  async create(createCommentDto: any, userId: string) {
    const comment = await this.prisma.comment.create({
      data: {
        ...createCommentDto,
        user: { connect: { id: userId } },
      },
    });
    return comment;
  }

  async update(id: string, updateCommentDto: any) {
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async delete(id: string) {
    return this.prisma.comment.delete({
      where: { id: id }
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async create(contentDto: any, lifeMomentId: string) {
    return await this.prisma.content.create({
      data: {
        ...contentDto,
        lifeMomentId: lifeMomentId,
      },
    });
  }

  async findAll(lifeMomentId: string) {
    return await this.prisma.content.findMany({
      where: {
        lifeMomentId: lifeMomentId,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.content.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateContentDto: any) {
    return await this.prisma.content.update({
      where: {
        id: id,
      },
      data: updateContentDto,
    });
  }

  async delete(id: string) {
    await this.prisma.content.delete({
      where: {
        id: id,
      },
    });
    return { message: 'Content deleted successfully' };
  }
}
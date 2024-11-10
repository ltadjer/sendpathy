import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentService } from '../content/content.service';

@Injectable()
export class LifeMomentService {
  constructor(
    private prisma: PrismaService,
    private contentService: ContentService
  ) {}

  async findAll(userId: string) {
    return await this.prisma.lifeMoment.findMany({
      where: {
        userId: userId
      },
      include: {
        contents: true,
      }
    });
  }

  async findOne(id: string, userId: string) {
    return await this.prisma.lifeMoment.findUnique({
      where: {
        id: id,
        userId: userId
      },
      include: {
        contents: true,
      }
    });
  }

  async create(createLifeMomentDto: any, userId: string) {
    const { contents, ...lifeMomentData } = createLifeMomentDto;

    const lifeMoment = await this.prisma.lifeMoment.create({
      data: {
        ...lifeMomentData,
        userId: userId
      }
    });

    if (contents && contents.length > 0) {
      for (const content of contents) {
        await this.contentService.create(content, lifeMoment.id);
      }
    }

    return lifeMoment;
  }

  async update(id: string, updateLifeMomentDto: any, userId: string) {
    const { contents, ...lifeMomentData } = updateLifeMomentDto;

    const lifeMoment = await this.prisma.lifeMoment.update({
      where: {
        id: id,
        userId: userId
      },
      data: lifeMomentData
    });

    if (contents && contents.length > 0) {
      for (const content of contents) {
        await this.contentService.update(content.id, content);
      }
    }

    return lifeMoment;
  }

  async delete(id: string, userId: string) {
    // Delete related contents first
    await this.prisma.content.deleteMany({
      where: {
        lifeMomentId: id,
      },
    });

    // Then delete the life moment
    await this.prisma.lifeMoment.delete({
      where: {
        id: id,
        userId: userId,
      },
    });

    return { message: 'Life moment deleted successfully' };
  }
}
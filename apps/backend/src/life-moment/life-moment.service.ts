import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ContentService } from '../content/content.service.js';

@Injectable()
export class LifeMomentService {
  constructor(
    private prisma: PrismaService,
    private contentService: ContentService
  ) {}

  async findAll(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user.accessCode) {
      throw new BadRequestException('Please set an access code before accessing life moments');
    }

    return await this.prisma.lifeMoment.findMany({
      where: { userId: userId },
      include: { contents: true },
    });
  }

  async findOne(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { lifeMoments: true },
    });

    if (!user.accessCode) {
      throw new BadRequestException('Please set an access code before accessing life moments');
    }

    return await this.prisma.lifeMoment.findUnique({
      where: { id: id, userId: userId },
      include: { contents: true },
    });
  }

  async create(createLifeMomentDto: any, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user.accessCode) {
      throw new BadRequestException('Please set an access code before creating a life moment');
    }

    const { contents, ...lifeMomentData } = createLifeMomentDto;

    const lifeMoment = await this.prisma.lifeMoment.create({
      data: { ...lifeMomentData, userId: userId },
    });

    if (contents && contents.length > 0) {
      for (const content of contents) {
        await this.contentService.create(content, lifeMoment.id);
      }
    }

    // Return the created life moment with its contents
    return await this.findOne(lifeMoment.id, userId);
  }

  async update(id: string, updateLifeMomentDto: any, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user.accessCode) {
      throw new BadRequestException('Please set an access code before updating a life moment');
    }

    const { contents, ...lifeMomentData } = updateLifeMomentDto;

    const lifeMoment = await this.prisma.lifeMoment.update({
      where: { id: id, userId: userId },
      data: lifeMomentData,
    });

    if (contents && contents.length > 0) {
      for (const content of contents) {
        if (content.id) {
          await this.contentService.update(content.id, content);
        } else {
          await this.contentService.create(content, lifeMoment.id);
        }
      }
    }

    return await this.findOne(lifeMoment.id, userId);
  }

  async delete(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user.accessCode) {
      throw new BadRequestException('Please set an access code before deleting a life moment');
    }

    // Delete related contents first
    await this.prisma.content.deleteMany({
      where: { lifeMomentId: id },
    });

    // Then delete the life moment
    await this.prisma.lifeMoment.delete({
      where: { id: id, userId: userId },
    });

    return { message: 'Life moment deleted successfully' };
  }
}
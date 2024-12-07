import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { saveFileToServer } from './utils/file.utils';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}


  async create(contentDto: any, lifeMomentId: string) {
    const fileUrl = await saveFileToServer(contentDto);

    return await this.prisma.content.create({
      data: {
        lifeMoment: { connect: { id: lifeMomentId } },
        type: contentDto.type,
        order: contentDto.order,
        originalName: contentDto.originalName,
        content: contentDto.content,
        fileUrl: fileUrl,
        size: contentDto.size,
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
    if (updateContentDto.base64Content) {
      const fileUrl = await saveFileToServer(updateContentDto);
      updateContentDto.fileUrl = fileUrl;
    }

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
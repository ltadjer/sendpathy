import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}
  async saveFileToServer(file: any): Promise<string> {
    const uploadPath = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalName}`;
    const filePath = path.join(uploadPath, fileName);
    fs.writeFileSync(filePath, Buffer.from(file.base64Content, 'base64'));

    return `/uploads/${fileName}`;
  }

  async create(contentDto: any, lifeMomentId: string) {
    const fileUrl = await this.saveFileToServer(contentDto);

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
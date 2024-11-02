import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.tag.findUnique({
      where: { id: id }
    })
  }

  async findAll() {
    return this.prisma.tag.findMany();
  }

  async create(createTagDto: any) {
    const tag = await this.prisma.tag.create({
      data: createTagDto
    });
    return tag;
  }

  async update(id: string, updateTagDto: any) {
    return this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
    });
  }

  async delete(id: string) {
    await this.prisma.tag.delete({
      where: { id: id }
    });
    return { message: 'Tag deleted' };
  }

}

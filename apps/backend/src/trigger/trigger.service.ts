import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class TriggerService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.trigger.findUnique({
      where: { id: id }
    })
  }

  async findAll() {
    return this.prisma.trigger.findMany();
  }

  async create(createTriggerDto: any) {
    const trigger = await this.prisma.trigger.create({
      data: createTriggerDto
    });
    return trigger;
  }

  async update(id: string, updateTriggerDto: any) {
    return this.prisma.trigger.update({
      where: { id },
      data: updateTriggerDto,
    });
  }

  async delete(id: string) {
    await this.prisma.trigger.delete({
      where: { id: id }
    });
    return { message: 'Trigger deleted' };
  }
}

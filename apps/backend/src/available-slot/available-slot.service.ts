import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AvailableSlotService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    return this.prisma.availableSlot.findMany();
  }

  async createSlots(therapistId: string, startTime: Date, endTime: Date, interval: number): Promise<void> {
    const slots = [];
    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const nextTime = new Date(currentTime.getTime() + interval * 60000);
      slots.push({
        therapistId,
        startTime: currentTime,
        endTime: nextTime,
      });
      currentTime = nextTime;
    }

    await this.prisma.availableSlot.createMany({ data: slots });
  }

  async findOne(id: string): Promise<any> {
    return this.prisma.availableSlot.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.availableSlot.update({
      where: { id },
      data,
    })
  }


}
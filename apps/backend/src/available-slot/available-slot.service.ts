import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailableSlotService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    return this.prisma.availableSlot.findMany();
  }

  async createSlots(therapistId: string, startTime: Date, endTime: Date, interval: number) {
    const slots = [];
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    let currentDate = new Date(startTime);

    while (currentDate < endTime) {
      // Set the start of the daily time range
      const dailyStart = new Date(currentDate);
      dailyStart.setHours(startHour, startMinute, 0, 0);

      // Set the end of the daily time range
      const dailyEnd = new Date(currentDate);
      dailyEnd.setHours(endHour, endMinute, 0, 0);

      let currentTime = new Date(dailyStart);

      // Generate slots within the daily time range
      while (currentTime < dailyEnd) {
        const nextTime = new Date(currentTime.getTime() + interval * 60000);
        if (nextTime <= dailyEnd) {
          slots.push({
            therapistId,
            startTime: currentTime,
            endTime: nextTime,
          });
        }
        currentTime = nextTime;
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log('slots', slots);
    return await this.prisma.availableSlot.createMany({ data: slots });
  }

  async findOne(id: string): Promise<any> {
    return await this.prisma.availableSlot.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any): Promise<any> {
    return await this.prisma.availableSlot.update({
      where: { id },
      data,
    })
  }

  async remove(id: string): Promise<void> {
    await await this.prisma.availableSlot.delete({
      where: { id },
    });
  }

}
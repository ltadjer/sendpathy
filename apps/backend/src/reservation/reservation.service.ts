import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<any> {
    if(!userId) {
      throw new Error('User ID is required');
    }
    return this.prisma.reservation.findMany({
      where: { userId: userId },
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string, userId: string): Promise<any> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const reservation = await this.prisma.reservation.findUnique({
      where: { id: id },
      include: {
        user: true,
      },
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.userId !== userId) {
      throw new Error('You are not authorized to view this reservation');
    }

    return reservation;
  }

  async isSlotAvailable(date: Date, startTime: Date, endTime: Date, therapistId: string): Promise<boolean> {
    const overlappingReservations = await this.prisma.reservation.findMany({
      where: {
        therapistId: therapistId,
        date: date,
        OR: [
          {
            startTime: { lte: endTime },
            endTime: { gte: startTime },
          },
        ],
      },
    });

    return overlappingReservations.length === 0;
  }

  async create(createReservationDto: any, userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { date, startTime, endTime, therapistId } = createReservationDto;

    const isAvailable = await this.isSlotAvailable(date, startTime, endTime, therapistId);
    if (!isAvailable) {
      throw new Error('The selected time slot is not available');
    }

    return this.prisma.reservation.create({
      data: {
        date,
        startTime,
        endTime,
        title: createReservationDto.title,
        userId,
        therapistId,
      },
      include: {
        user: true,
      },
    });
  }


  async update(id: string, updateReservationDto: any, userId: string): Promise<any> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const reservation = await this.prisma.reservation.findUnique({
      where: { id: id },
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.userId !== userId) {
      throw new Error('You are not authorized to update this reservation');
    }

    const { date, startTime, endTime, therapistId } = updateReservationDto;

    const isAvailable = await this.isSlotAvailable(date, startTime, endTime, therapistId);
    if (!isAvailable) {
      throw new Error('The selected time slot is not available');
    }

    // Mark the previous slot as available
    await this.prisma.reservation.update({
      where: { id: id },
      data: {
        isCancelled: true,
      },
    });

    return this.prisma.reservation.update({
      where: { id: id },
      data: updateReservationDto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: string, userId: string): Promise<any> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const reservation = await this.prisma.reservation.findUnique({
      where: { id: id },
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.userId !== userId) {
      throw new Error('You are not authorized to delete this reservation');
    }

    // Mark the slot as available
    await this.prisma.reservation.update({
      where: { id: id },
      data: {
        isCancelled: true,
      },
    });

    return this.prisma.reservation.delete({
      where: { id: id },
    });
  }

  async findAllAvailableSlots(therapistId: string): Promise<any> {
    return this.prisma.reservation.findMany({
      where: {
        therapistId: therapistId,
        isCancelled: false,
      },
      select: {
        date: true,
        startTime: true,
        endTime: true,
      },
    });
  }

  async findAllTherapists(): Promise<any> {
    return this.prisma.user.findMany({
      where: {
        role: 'THERAPIST',
      },
      select: {
        id: true,
        username: true,
      },
    });
  }
}

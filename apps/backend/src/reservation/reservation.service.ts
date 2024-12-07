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

  async create(createReservationDto: any, userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Ensure the date is in ISO-8601 format
    const date = new Date(createReservationDto.date).toISOString();

    return this.prisma.reservation.create({
      data: {
        date,
        title: createReservationDto.title,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, updateReservationDto: any, userId: string): Promise<any> {
    if(!userId) {
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

    return this.prisma.reservation.delete({
      where: { id: id },
    });
  }
}

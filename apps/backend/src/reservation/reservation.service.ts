import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { AvailableSlotService } from '../available-slot/available-slot.service'

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService,
              private availableSlotService: AvailableSlotService) {}

  async findAll(userId: string): Promise<any> {
    if(!userId) {
      throw new Error('User ID is required');
    }
    return this.prisma.reservation.findMany({
      where: { userId: userId },
      include: {
        user: true,
        slot: true,
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
        slot: true,
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

  async create(createReservationDto: any, userId: string): Promise<any> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const slot = await this.availableSlotService.findOne(createReservationDto.slotId);

    if (!slot || slot.isBooked) {
      throw new Error('Slot is not available');
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        slotId: createReservationDto.slotId,
        userId,
      },
    });

    console.log('reservation', reservation);

    await this.availableSlotService.update(createReservationDto.slotId, { isBooked: true });

    return reservation;
  }

  async update(id: string, updateReservationDto: any, userId: string): Promise<any> {
    if(!userId) {
      throw new Error('User ID is required');
    }

    const reservation = await this.findOne(id, userId);

    console.log('reservation', reservation);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.userId !== userId) {
      throw new Error('You are not authorized to update this reservation');
    }
    await this.availableSlotService.update(reservation.slotId, { isBooked: false });

    const newReservation = this.prisma.reservation.update({
      where: { id: id },
      data: {
        slotId: updateReservationDto.slotId,
      },
      include: {
        user: true,
      },
    });

    await this.availableSlotService.update(updateReservationDto.slotId, { isBooked: true });

    return newReservation;

  }

  async cancel(id: string, userId: string): Promise<any> {
    const reservation = await this.findOne(id, userId);

    if (!reservation || reservation.userId !== userId) {
      throw new Error('Reservation not found or unauthorized');
    }

    await this.prisma.reservation.delete({ where: { id } });

    await this.availableSlotService.update(reservation.slotId, { isBooked: false });
  }
}

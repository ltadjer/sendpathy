import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service.js';
import { ReservationController } from './reservation.controller.js'
import { PrismaModule } from '../prisma/prisma.module.js'
import { AvailableSlotModule } from '../available-slot/available-slot.module.js'
import { AvailableSlotService } from '../available-slot/available-slot.service.js'

@Module({
  controllers: [ReservationController],
  providers: [ReservationService, AvailableSlotService],
  imports: [PrismaModule, AvailableSlotModule],
})
export class ReservationModule {}

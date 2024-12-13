import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { AvailableSlotModule } from '../available-slot/available-slot.module'
import { AvailableSlotService } from '../available-slot/available-slot.service'

@Module({
  controllers: [ReservationController],
  providers: [ReservationService, AvailableSlotService],
  imports: [PrismaModule, AvailableSlotModule],
})
export class ReservationModule {}

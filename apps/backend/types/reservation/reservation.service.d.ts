import { PrismaService } from '../prisma/prisma.service';
import { AvailableSlotService } from '../available-slot/available-slot.service';
export declare class ReservationService {
    private prisma;
    private availableSlotService;
    constructor(prisma: PrismaService, availableSlotService: AvailableSlotService);
    findAll(userId: string): Promise<any>;
    findOne(id: string, userId: string): Promise<any>;
    create(createReservationDto: any, userId: string): Promise<any>;
    update(id: string, updateReservationDto: any, userId: string): Promise<any>;
    cancel(id: string, userId: string): Promise<any>;
}

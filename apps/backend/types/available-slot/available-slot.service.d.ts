import { PrismaService } from '../prisma/prisma.service';
export declare class AvailableSlotService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    createSlots(therapistId: string, startTime: Date, endTime: Date, interval: number): Promise<void>;
    findOne(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
}

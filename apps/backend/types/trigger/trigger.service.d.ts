import { PrismaService } from '../prisma/prisma.service';
export declare class TriggerService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<any>;
    findAll(): Promise<any>;
    create(createTriggerDto: any): Promise<any>;
    update(id: string, updateTriggerDto: any): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
}

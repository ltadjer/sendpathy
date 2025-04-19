import { PrismaService } from '../prisma/prisma.service';
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(contentDto: any, lifeMomentId: string): Promise<any>;
    findAll(lifeMomentId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateContentDto: any): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
}

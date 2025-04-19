import { PrismaService } from '../prisma/prisma.service';
import { ContentService } from '../content/content.service';
export declare class LifeMomentService {
    private prisma;
    private contentService;
    constructor(prisma: PrismaService, contentService: ContentService);
    findAll(userId: string): Promise<any>;
    findOne(id: string, userId: string): Promise<any>;
    create(createLifeMomentDto: any, userId: string): Promise<any>;
    update(id: string, updateLifeMomentDto: any, userId: string): Promise<any>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}

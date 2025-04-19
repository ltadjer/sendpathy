import { PrismaService } from 'src/prisma/prisma.service';
export declare class TagService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<any>;
    findAll(): Promise<any>;
    create(createTagDto: any): Promise<any>;
    update(id: string, updateTagDto: any): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
}

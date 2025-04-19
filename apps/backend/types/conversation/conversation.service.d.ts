import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { MessageService } from 'src/message/message.service';
export declare class ConversationService {
    private prisma;
    private messageService;
    constructor(prisma: PrismaService, messageService: MessageService);
    create(createConversationDto: CreateConversationDto): Promise<{
        id: any;
        conversationType: any;
        createdAt: any;
        updatedAt: any;
        deletedAt: any;
        user: {
            id: any;
            username: any;
            avatar: any;
        } | null;
        lastMessage: any;
    }>;
    findAll(userId: string): Promise<any>;
    findOne(id: string, userId: string): Promise<{
        id: any;
        conversationType: any;
        createdAt: any;
        updatedAt: any;
        deletedAt: any;
        user: {
            id: any;
            username: any;
            avatar: any;
        } | null;
        lastMessage: any;
    }>;
    update(id: string, updateConversationDto: UpdateConversationDto, userId: string): Promise<any>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}

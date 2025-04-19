import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageGateway } from './message.gateway';
export declare class MessageService {
    private prisma;
    private messageGateway;
    constructor(prisma: PrismaService, messageGateway: MessageGateway);
    findOne(id: string): Promise<any>;
    findAll(): Promise<any>;
    findByConversation(conversationId: string, userId: string, page: number, limit: number): Promise<any>;
    create(createMessageDto: CreateMessageDto, senderId: string): Promise<any>;
    update(id: string, updateMessageDto: UpdateMessageDto, senderId: string): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
    deleteForUser(messageId: string, userId: string): Promise<any>;
    markMessagesAsRead(conversationId: string, userId: string): Promise<any>;
}

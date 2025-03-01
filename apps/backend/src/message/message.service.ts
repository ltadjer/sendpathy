import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageGateway } from './message.gateway';

@Injectable()
export class MessageService {
    constructor(private prisma: PrismaService, private messageGateway: MessageGateway) {}

    async findOne(id: string) {
        return this.prisma.message.findUnique({
            where: { id: id }
        });
    }

    async findAll() {
        return this.prisma.message.findMany();
    }

    async findByConversation(conversationId: string, userId: string) {
        const messages = await this.prisma.message.findMany({
            where: { conversationId: conversationId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: true,
                receiver: true,
                conversation: {
                    select: { users: true },
                },
            },
        });

        return messages.map(message => ({
            ...message,
            isSentByCurrentUser: message.senderId === userId,
        }));
    }

    async create(createMessageDto: CreateMessageDto, senderId: string) {
        // Check if a conversation exists between the users
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                AND: [
                    { users: { some: { id: senderId } } },
                    { users: { some: { id: createMessageDto.receiverId } } },
                ],
            },
        });

        if (!conversation) {
            throw new ForbiddenException('No conversation exists between these users.');
        }

        // Check if the users are friends
        const friendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: senderId, receiverId: createMessageDto.receiverId, status: 'ACCEPTED' },
                    { requesterId: createMessageDto.receiverId, receiverId: senderId, status: 'ACCEPTED' },
                ],
            },
        });

        if (!friendship) {
            throw new ForbiddenException('No friendship exists between these users.');
        }

        const message = await this.prisma.message.create({
            data: {
                ...createMessageDto,
                senderId: senderId,
                conversationId: conversation.id, // Link the message to the conversation
            },
        });
        this.messageGateway.sendMessage(message);
        return message;
    }

    async update(id: string, updateMessageDto: UpdateMessageDto, senderId: string) {
        const message = await this.prisma.message.findUnique({
            where: { id },
        });

        if (!message) {
            throw new NotFoundException('Message not found.');
        }

        // Check if the sender is the owner of the message
        if (message.senderId !== senderId) {
            throw new ForbiddenException('You are not the owner of this message.');
        }

        return this.prisma.message.update({
            where: { id },
            data: {
                ...updateMessageDto,
                conversationId: message.conversationId, // Ensure the conversationId remains linked
            },
        });
    }

    async delete(id: string) {
        await this.prisma.message.delete({
            where: { id: id }
        });
        return { message: 'Message deleted successfully' };
    }

    async deleteForUser(messageId: string, userId: string) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });

        if (!message) {
            throw new NotFoundException('Message not found.');
        }

        return this.prisma.message.update({
            where: { id: messageId },
            data: { deletedBy: userId },
        });
    }
}
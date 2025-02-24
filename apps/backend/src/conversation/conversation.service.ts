import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class ConversationService {
    constructor(private prisma: PrismaService, private messageService: MessageService) {}

    async create(createConversationDto: CreateConversationDto) {
        // Check if all users have accepted friendships
        for (const userId of createConversationDto.userIds) {
            for (const otherUserId of createConversationDto.userIds) {
                if (userId !== otherUserId) {
                    const friendship = await this.prisma.friendship.findFirst({
                        where: {
                            OR: [
                                { requesterId: userId, receiverId: otherUserId, status: 'ACCEPTED' },
                                { requesterId: otherUserId, receiverId: userId, status: 'ACCEPTED' },
                            ],
                        },
                    });

                    if (!friendship) {
                        throw new ForbiddenException(`No accepted friendship exists between users ${userId} and ${otherUserId}.`);
                    }
                }
            }
        }

        // Check if a conversation already exists between the users
        const existingConversation = await this.prisma.conversation.findFirst({
            where: {
                AND: createConversationDto.userIds.map(userId => ({
                    users: {
                        some: { id: userId },
                    },
                })),
            },
        });

        if (existingConversation) {
            throw new ConflictException('A conversation between these users already exists.');
        }

        // Create the conversation
        return this.prisma.conversation.create({
            data: {
                users: {
                    connect: createConversationDto.userIds.map(id => ({ id })),
                },
                conversationType: createConversationDto.conversationType,
            },
        });
    }


    async findAll(userId: string) {
        const conversations = await this.prisma.conversation.findMany({
            where: {
                users: {
                    some: { id: userId },
                },
            },
            include: { users: true, messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });

        return conversations.map(conversation => {
            const receiver = conversation.users.find(user => user.id !== userId);
            return {
                id: conversation.id,
                conversationType: conversation.conversationType,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt,
                deletedAt: conversation.deletedAt,
                user: receiver ? { id: receiver.id, username: receiver.username, avatar: receiver.avatar } : null,
                lastMessage: conversation.messages[0] || null,
            };
        });
    }

    async findOne(id: string, userId: string) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id },
            include: { users: true, messages: true },
        });

        if (!conversation || !conversation.users.some(user => user.id === userId)) {
            throw new NotFoundException('Conversation not found or you are not a participant.');
        }

        const receiver = conversation.users.find(user => user.id !== userId);
        return {
            ...conversation,
            name: receiver ? receiver.username : 'Unknown',
        };
    }

    async update(id: string, updateConversationDto: UpdateConversationDto, userId: string) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id },
            include: { users: true },
        });

        if (!conversation || !conversation.users.some(user => user.id === userId)) {
            throw new NotFoundException('Conversation not found or you are not a participant.');
        }

        // Check if all users have accepted friendships
        for (const userId of conversation.users.map(user => user.id)) {
            for (const otherUserId of conversation.users.map(user => user.id)) {
                if (userId !== otherUserId) {
                    const friendship = await this.prisma.friendship.findFirst({
                        where: {
                            OR: [
                                { requesterId: userId, receiverId: otherUserId, status: 'ACCEPTED' },
                                { requesterId: otherUserId, receiverId: userId, status: 'ACCEPTED' },
                            ],
                        },
                    });

                    if (!friendship) {
                        throw new ForbiddenException(`No accepted friendship exists between users ${userId} and ${otherUserId}.`);
                    }
                }
            }
        }

        return this.prisma.conversation.update({
            where: { id },
            data: {
                users: {
                    connect: updateConversationDto.userIds?.map(id => ({ id })),
                },
                conversationType: updateConversationDto.conversationType,
            },
        });;
    }

    async delete(id: string, userId: string) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id },
            include: { users: true, messages: true },
        });

        if (!conversation || !conversation.users.some(user => user.id === userId)) {
            throw new NotFoundException('Conversation not found or you are not a participant.');
        }

        // Soft delete: mark all messages in the conversation as deleted for the requesting user
        for (const message of conversation.messages) {
            await this.messageService.deleteForUser(message.id, userId);
        }
        return { message: 'Messages marked as deleted for the user.' };

    }

}
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { NotificationType } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';
@Injectable()
export class FriendshipService {
    constructor(
      private prisma: PrismaService,
      private notificationService: NotificationService,
      private notificationGateway: NotificationGateway,
    ) {}

    async create(createFriendshipDto: CreateFriendshipDto) {
        const existingFriendship = await this.prisma.friendship.findFirst({
            where: {
                requesterId: createFriendshipDto.requesterId,
                receiverId: createFriendshipDto.receiverId,
            },
        });

        if (existingFriendship) {
            throw new ConflictException('Friendship already exists between these users.');
        }

        const newFriendship = await this.prisma.friendship.create({
            data: {
                requester: { connect: { id: createFriendshipDto.requesterId } },
                receiver: { connect: { id: createFriendshipDto.receiverId } },
                status: createFriendshipDto.status,
            },
        });

        const requester = await this.prisma.user.findUnique({
            where: { id: createFriendshipDto.requesterId },
        });

        const message = `Vous avez reçu une demande d'ami de ${requester.username}`;
        await this.notificationGateway.sendNotificationToUser(
          createFriendshipDto.receiverId,
          NotificationType.FRIEND_REQUEST,
          message,
          createFriendshipDto.requesterId,
        );
        return newFriendship;
    }


    async findAll() {
        return this.prisma.friendship.findMany();
    }

    async findOne(id: string) {
        return this.prisma.friendship.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateFriendshipDto: UpdateFriendshipDto) {
        return this.prisma.friendship.update({
            where: { id },
            data: updateFriendshipDto,
        });
    }

    async delete(id: string) {
        await this.prisma.friendship.delete({
            where: { id },
        });
        return { message: "Friendship deleted." };
    }

    async acceptFriendship(id: string) {
        const friendship = await this.prisma.friendship.findUnique({
            where: { id },
        });

        if (!friendship) {
            throw new NotFoundException('Friendship not found.');
        }

        const updatedFriendship = await this.prisma.friendship.update({
            where: { id },
            data: { status: 'ACCEPTED', startedAt: new Date() },
            include: { requester: true, receiver: true },
        });

        console.log(updatedFriendship);

        const message = `${updatedFriendship.receiver.username} a accepté votre demande d'ami`;
        await this.notificationGateway.sendNotificationToUser(
          friendship.requesterId,
          NotificationType.FRIEND_REQUEST,
          message,
          friendship.receiverId,
        );

        return updatedFriendship;
    }
}
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';

@Injectable()
export class FriendshipService {
    constructor(private prisma: PrismaService) {}

    async create(createFriendshipDto: CreateFriendshipDto) {

        // Check if the friendship already exists
        // Check if the friendship already exists
        const existingFriendship = await this.prisma.friendship.findFirst({
            where: {
                requesterId: createFriendshipDto.requesterId,
                receiverId: createFriendshipDto.receiverId,
            },
        });

        if (existingFriendship) {
            throw new ConflictException('Friendship already exists between these users.');
        }

        // Create the new friendship
        return this.prisma.friendship.create({
            data: {
                requester: { connect: { id: createFriendshipDto.requesterId } },
                receiver: { connect: { id: createFriendshipDto.receiverId } },
                status: createFriendshipDto.status,
            },
        });
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
        console.log(friendship);

        if (!friendship) {
            throw new NotFoundException('Friendship not found.');
        }

        return this.prisma.friendship.update({
            where: { id },
            data: { status: 'ACCEPTED', startedAt: new Date() },
        });
    }
}
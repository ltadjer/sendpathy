import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { FriendshipStatus } from '@prisma/client';

export class CreateFriendshipDto {
    @IsString()
    @IsNotEmpty()
    requesterId: string;

    @IsString()
    @IsNotEmpty()
    receiverId: string;

    @IsEnum(FriendshipStatus)
    status: FriendshipStatus;
}
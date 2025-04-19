import { FriendshipStatus } from '@prisma/client';
export declare class CreateFriendshipDto {
    requesterId: string;
    receiverId: string;
    status: FriendshipStatus;
}

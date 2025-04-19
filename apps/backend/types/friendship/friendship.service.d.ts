import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';
export declare class FriendshipService {
    private prisma;
    private notificationService;
    private notificationGateway;
    constructor(prisma: PrismaService, notificationService: NotificationService, notificationGateway: NotificationGateway);
    create(createFriendshipDto: CreateFriendshipDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateFriendshipDto: UpdateFriendshipDto): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
    acceptFriendship(id: string): Promise<any>;
}

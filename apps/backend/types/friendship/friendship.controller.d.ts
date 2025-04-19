import { FriendshipService } from './friendship.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
export declare class FriendshipController {
    private readonly friendshipService;
    constructor(friendshipService: FriendshipService);
    create(createFriendshipDto: CreateFriendshipDto): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateFriendshipDto: UpdateFriendshipDto): any;
    remove(id: string): any;
    accept(id: string): any;
}

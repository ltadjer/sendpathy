import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<any>;
    findAllTherapists(): Promise<any>;
    setAccessCode(user: any, accessCode: string): Promise<any>;
    validateAccessCode(user: any, accessCode: string): Promise<any>;
    findOne(id: string): Promise<any>;
    findOneByEmail(email: string): Promise<any>;
    create(createUserDto: CreateUserDto): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    delete(id: string): Promise<any>;
    updateTags(userId: string, tagIds: string[]): Promise<any>;
    updateTriggers(userId: string, triggerIds: string[]): Promise<any>;
}

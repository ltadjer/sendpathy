import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateTherapistDto } from './dto/create-therapist.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<any>;
    findOneByEmail(email: string): Promise<any>;
    findAll(): Promise<any>;
    findAllTherapists(): Promise<any>;
    create(createUserDto: CreateUserDto | CreateTherapistDto): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    delete(id: string): Promise<{
        message: string;
    }>;
    findByToken(token: string): Promise<any>;
    findByResetPasswordToken(token: string): Promise<any>;
    requestPasswordReset(email: string): Promise<string>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<any>;
    findByRefreshToken(refreshToken: string): Promise<any>;
    updateAccessCode(userId: string, accessCode: string): Promise<any>;
    validateAccessCode(userId: string, accessCode: string): Promise<boolean>;
    associateTags(userId: string, tagIds: string[]): Promise<any>;
    associateTriggers(userId: string, triggerIds: string[]): Promise<any>;
}

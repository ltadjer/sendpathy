import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { CreateTherapistDto } from '../user/dto/create-therapist.dto';
import { UserService } from '../user/user.service';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    login(req: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    register(createUserDto: any): Promise<any>;
    logout(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(user: any): Promise<{
        email: any;
        username: any;
        avatar: any;
        id: any;
        nativeLanguage: any;
        accessCode: any;
        friendshipsReceived: any;
        friendshipsSent: any;
        biography: any;
        age: any;
        createdAt: any;
        tags: any;
        triggers: any;
    }>;
    registerTherapist(createTherapistDto: CreateTherapistDto): Promise<any>;
    confirmEmail(token: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    requestPasswordReset(email: string): Promise<any>;
    resetPassword(token: string, newPassword: string): Promise<any>;
    refreshToken(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}

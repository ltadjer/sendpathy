import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MailerService } from '../mailer/mailer.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateTherapistDto } from 'src/user/dto/create-therapist.dto';
export declare class AuthService {
    private jwtService;
    private userService;
    private mailerService;
    constructor(jwtService: JwtService, userService: UserService, mailerService: MailerService);
    validateUser(email: string, password: string): Promise<any>;
    login(email: string, password: string): Promise<{
        access_token: string;
        refresh_token: string;
        email: any;
        accessCode: any;
        avatar: any;
        username: any;
        id: any;
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateRegistrationData(email: string, password: string): void;
    register(data: CreateUserDto | CreateTherapistDto): Promise<{
        message: string;
    }>;
    confirmEmail(token: string): Promise<void>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<any>;
}

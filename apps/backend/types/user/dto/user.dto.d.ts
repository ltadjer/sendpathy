import { UserRole } from '@prisma/client';
export declare class UserDto {
    email: string;
    password: string;
    slug: string;
    role: UserRole;
}

import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserDto {
  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Slug of the user' })
  @IsString()
  @IsOptional()
  slug: string = '';

  @ApiProperty({ description: 'User role' })
  @IsString()
  @IsOptional()
  role: UserRole = UserRole.USER;
}
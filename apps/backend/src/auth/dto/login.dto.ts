import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'Email of the user' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({ description: 'Password of the user' })
    @IsString()
    @IsNotEmpty()
    password: string;
  }
  

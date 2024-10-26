import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Age of the user' })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({ description: 'Native language of the user' })
  @IsString()
  @IsNotEmpty()
  nativeLanguage: string;

  @ApiProperty({ description: 'Slug for the user' })
  @IsString()
  @IsNotEmpty()
  slug: string;
}

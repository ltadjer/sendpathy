import { IsEmail, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  nativeLanguage: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}

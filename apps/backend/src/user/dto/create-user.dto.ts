import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto.js';

export class CreateUserDto extends UserDto {
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

}

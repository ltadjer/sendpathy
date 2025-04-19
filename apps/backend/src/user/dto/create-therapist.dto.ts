import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto.js';

export class CreateTherapistDto extends UserDto {
  @ApiProperty({ description: 'First name of the therapist' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of the therapist' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Biography of the therapist' })
  @IsString()
  biography: string;

}
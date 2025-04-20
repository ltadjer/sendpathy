import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'Confirmation token for the user', required: false })
  confirmationToken?: string;

  @ApiProperty({ description: 'Active status of the user', required: false })
  isActive?: boolean;

  @ApiProperty({ description: 'Access code for the user', required: false })
  accessCode?: string;

  @ApiProperty({ description: 'Avatar URL of the user', required: false })
  avatar?: string;

  @ApiProperty({ description: 'Username of the user', required: false })
  username?: string;

  @ApiProperty({ description: 'Password of the user', required: false })
  password?: string;
}
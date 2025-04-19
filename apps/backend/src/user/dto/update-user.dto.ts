import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'Confirmation token for the user', required: false })
  confirmationToken?: string;

  @ApiProperty({ description: 'Active status of the user', required: false })
  isActive?: boolean;

  @ApiProperty({ description: 'Access code for the user', required: false })
  accessCode?: string;
}
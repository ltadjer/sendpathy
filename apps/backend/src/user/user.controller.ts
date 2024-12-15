import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards, NotFoundException
} from '@nestjs/common'
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':email')
  async findOneByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/access-code')
  @ApiOperation({ summary: 'Set the access code for a user' })
  @ApiResponse({
    status: 200,
    description: 'The access code has been successfully set.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async setAccessCode(@Body('token') token: string, @Body('accessCode') accessCode: string) {
    console.log('token', token);
    console.log('accessCode', accessCode);
    const user = await this.userService.findByRefreshToken(token);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('user', user);
    return await this.userService.updateAccessCode(user.id, accessCode);

  }

  @UseGuards(JwtAuthGuard)
  @Post('/validate-access-code')
  @ApiOperation({ summary: 'Validate the access code for a user' })
  @ApiResponse({
    status: 200,
    description: 'The access code is valid.',
  })
  @ApiResponse({ status: 404, description: 'User not found or invalid access code.' })
  async validateAccessCode(@Body('token') token: string, @Body('accessCode') accessCode: string) {
    console.log('token', token);
    const user = await this.userService.findByRefreshToken(token);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userService.validateAccessCode(user.id, accessCode);
  }

  @UseGuards(JwtAuthGuard)
  @Get('therapists')
  @ApiOperation({ summary: 'Get all therapists' })
  @ApiResponse({ status: 200, description: 'Return all therapists.' })
  async findAllTherapists() {
    return this.userService.findAllTherapists();
  }


}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Put,
  UseGuards, NotFoundException
} from '@nestjs/common'
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('therapists')
  @ApiOperation({ summary: 'Get all therapists' })
  @ApiResponse({ status: 200, description: 'Return all therapists.' })
  async findAllTherapists() {
    return await this.userService.findAllTherapists();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/access-code')
  @ApiOperation({ summary: 'Set the access code for a user' })
  @ApiResponse({
    status: 200,
    description: 'The access code has been successfully set.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async setAccessCode(@User() user: any, @Body('accessCode') accessCode: string) {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userService.updateAccessCode(existingUser.id, accessCode);

  }

  @UseGuards(JwtAuthGuard)
  @Post('/validate-access-code')
  @ApiOperation({ summary: 'Validate the access code for a user' })
  @ApiResponse({
    status: 200,
    description: 'The access code is valid.',
  })
  @ApiResponse({ status: 404, description: 'User not found or invalid access code.' })
  async validateAccessCode(@User() user: any, @Body('accessCode') accessCode: string) {
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const result = await this.userService.validateAccessCode(existingUser.id, accessCode)
    console.log(result)
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':email')
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  async findOneByEmail(@Param('email') email: string) {
    return await this.userService.findOneByEmail(email);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
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
    return await this.userService.update(id, updateUserDto);
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
    return await this.userService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/tags')
  @ApiOperation({ summary: 'Update a user\'s tags' })
  @ApiResponse({
    status: 200,
    description: 'The user\'s tags have been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateTags(@Param('id') userId: string, @Body('tagIds') tagIds: string[]) {
    console.log('tagIds', tagIds)
    return await this.userService.associateTags(userId, tagIds);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/triggers')
  @ApiOperation({ summary: 'Update a user\'s triggers' })
  @ApiResponse({
    status: 200,
    description: 'The user\'s triggers have been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateTriggers(@Param('id') userId: string, @Body('triggerIds') triggerIds: string[]) {
    console.log('triggerIds', triggerIds)
    return await this.userService.associateTriggers(userId, triggerIds);
  }

}

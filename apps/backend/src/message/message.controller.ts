import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { UpdateMessageDto } from './dto/update-message.dto';

@ApiTags('messages')
@Controller('messages')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get all messages' })
    @ApiResponse({ status: 200, description: 'Return all messages.' })
    async findAll() {
        return this.messageService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiResponse({ status: 200, description: 'Return the message.' })
    @ApiResponse({ status: 404, description: 'Message not found.' })
    async findOne(@Param('id') id: string) {
        return this.messageService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiResponse({ status: 201, description: 'The message has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    async create(@Body() createMessageDto: CreateMessageDto, @User() user: any) {
        console.log('user', user);
        return this.messageService.create(createMessageDto, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: 'Update a message by ID' })
    @ApiResponse({ status: 200, description: 'The message has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Post not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateMessageDto: UpdateMessageDto,
        @User() user: any
    ){
        return this.messageService.update(id, updateMessageDto, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a message by ID' })
    @ApiResponse({ status: 200, description: 'The message has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Post not found.' })
    async delete(@Param('id') id: string) {
        return this.messageService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/user')
    async deleteForUser(@Param('id') id: string, @User() user: any) {
        return this.messageService.deleteForUser(id, user.id);
    }
}
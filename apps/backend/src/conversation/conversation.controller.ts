import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import {MessageService} from "../message/message.service";
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationController {
    constructor(private readonly conversationService: ConversationService, private readonly messageService: MessageService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createConversationDto: CreateConversationDto) {
        return this.conversationService.create(createConversationDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@User() user: any) {
        return await this.conversationService.findAll(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string, @User() user: any) {
        return await this.conversationService.findOne(id, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':conversationId/messages')
    @ApiResponse({ status: 200, description: 'Return messages for the conversation.' })
    @ApiResponse({ status: 404, description: 'Conversation not found.' })
    async findMessagesByConversation( @Param('conversationId') conversationId: string,
                                      @User() user: any,
                                      @Query('page') page: number = 1,
                                      @Query('limit') limit: number = 12) {
        return this.messageService.findByConversation(conversationId, user.id, page, limit);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateConversationDto: UpdateConversationDto,
        @User() user: any
    ) {
        return this.conversationService.update(id, updateConversationDto, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string, @User() user: any) {
        await this.conversationService.delete(id, user.id);
        return {message: "Conversation deleted"};
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':conversationId/mark-read')
    async markMessagesAsRead(@Param('conversationId') conversationId: string, @User() user: any) {
        return await this.messageService.markMessagesAsRead(conversationId, user.id);
    }
}
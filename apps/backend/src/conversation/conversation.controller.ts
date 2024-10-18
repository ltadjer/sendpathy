import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/decorators/user.decorator';

@Controller('conversations')
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createConversationDto: CreateConversationDto) {
        return this.conversationService.create(createConversationDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@User() user: any) {
        return this.conversationService.findAll(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string, @User() user: any) {
        return this.conversationService.findOne(id, user.id);
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
        return this.conversationService.delete(id, user.id);
    }
}
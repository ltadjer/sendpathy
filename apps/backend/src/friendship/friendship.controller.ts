import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('friendships')
export class FriendshipController {
    constructor(private readonly friendshipService: FriendshipService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createFriendshipDto: CreateFriendshipDto) {
        return this.friendshipService.create(createFriendshipDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.friendshipService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.friendshipService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFriendshipDto: UpdateFriendshipDto) {
        return this.friendshipService.update(id, updateFriendshipDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.friendshipService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/accept')
    accept(@Param('id') id: string) {
        return this.friendshipService.acceptFriendship(id);
    }
}
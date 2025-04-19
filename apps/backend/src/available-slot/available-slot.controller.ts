import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { AvailableSlotService } from './available-slot.service.js';
import { User } from '../user/decorators/user.decorator.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('available-slots')
@Controller('available-slots')
export class AvailableSlotController {
  constructor(private readonly availableSlotService: AvailableSlotService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create available slots' })
  @ApiResponse({ status: 201, description: 'The available slots have been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async createSlots(@Body() createSlotsDto: any, @User() user: any) {
    const { startTime, endTime, interval } = createSlotsDto;
    return this.availableSlotService.createSlots(user.id, new Date(startTime), new Date(endTime), interval);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all available slots' })
  @ApiResponse({ status: 200, description: 'Return all available slots.' })
  async findAll() {
    return this.availableSlotService.findAll();
  }

}
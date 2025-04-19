import { Controller, Get, Post, Body, Param, Patch, UseGuards, Delete } from '@nestjs/common';
import { AvailableSlotService } from './available-slot.service';
import { User } from '../user/decorators/user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
    console.log('createSlotsDto', createSlotsDto);
    console.log('user', user);
    return await this.availableSlotService.createSlots(user.id, new Date(startTime), new Date(endTime), interval);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all available slots' })
  @ApiResponse({ status: 200, description: 'Return all available slots.' })
  async findAll() {
    return this.availableSlotService.findAll();
  }



  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an available slot' })
  @ApiResponse({ status: 200, description: 'The available slot has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Available slot not found.' })
  async update(@Param('id') id: string, @Body() updateSlotDto: any) {
    return this.availableSlotService.update(id, updateSlotDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an available slot' })
  @ApiResponse({ status: 200, description: 'The available slot has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Available slot not found.' })
  async remove(@Param('id') id: string) {
    return this.availableSlotService.remove(id);
  }

}
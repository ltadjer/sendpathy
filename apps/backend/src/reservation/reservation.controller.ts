import { ReservationService } from './reservation.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '../user/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Get, Param, Post, Body, Patch, Delete, Query, Controller, UseGuards, HttpException, HttpStatus } from '@nestjs/common';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  @ApiResponse({ status: 200, description: 'Return all reservations.' })
  async findAll(@User() user: any) {
    return this.reservationService.findAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return the reservation.' })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  async findOne(@Param('id') id: string, @User() user: any) {
    return this.reservationService.findOne(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'The reservation has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createReservationDto: any, @User() user: any) {
      console.log('createReservationDto', createReservationDto);
      console.log('user', user);
      return await this.reservationService.create(createReservationDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a reservation by ID' })
  @ApiResponse({ status: 200, description: 'The reservation has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: any,
    @User() user: any
  ) {
    try {
      return await this.reservationService.update(id, updateReservationDto, user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/update-status')
  @ApiOperation({ summary: 'Update reservation status by ID' })
  @ApiResponse({ status: 200, description: 'The reservation status has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { isCancelled: boolean },
    @User() user: any
  ) {
    try {
      return await this.reservationService.updateReservationStatus(id, body.isCancelled);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
import { LifeMomentService } from './life-moment.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';

@ApiTags('life-moments')
@Controller('life-moments')
export class LifeMomentController {
  constructor(private readonly lifeMomentService: LifeMomentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all life moments' })
  @ApiResponse({ status: 200, description: 'Return all life moments.' })
  async findAll(@User() user: any) {
    return this.lifeMomentService.findAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return the life moment.' })
  @ApiResponse({ status: 404, description: 'Life moment not found.' })
  async findOne(@Param('id') id: string,  @User() user: any) {
    return this.lifeMomentService.findOne(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'The life moment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createLifeMomentDto: any, @User() user: any) {
    return this.lifeMomentService.create(createLifeMomentDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a life moment by ID' })
  @ApiResponse({ status: 200, description: 'The life moment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Life moment not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateLifeMomentDto: any,
    @User() user: any
  ){
    return this.lifeMomentService.update(id, updateLifeMomentDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a life moment by ID' })
  @ApiResponse({ status: 200, description: 'The life moment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Life moment not found.' })
  async delete(@Param('id') id: string, @User() user: any) {
    return this.lifeMomentService.delete(id, user.id);
  }
}
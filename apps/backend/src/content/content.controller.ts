import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('contents')
@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':lifeMomentId')
  @ApiResponse({ status: 201, description: 'The content has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() contentDto: any, @Param('lifeMomentId') lifeMomentId: string) {
    return this.contentService.create(contentDto, lifeMomentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':lifeMomentId')
  @ApiOperation({ summary: 'Get all contents for a life moment' })
  @ApiResponse({ status: 200, description: 'Return all contents.' })
  async findAll(@Param('lifeMomentId') lifeMomentId: string) {
    return this.contentService.findAll(lifeMomentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('content/:id')
  @ApiResponse({ status: 200, description: 'Return the content.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  async findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('content/:id')
  @ApiOperation({ summary: 'Update a content by ID' })
  @ApiResponse({ status: 200, description: 'The content has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  async update(@Param('id') id: string, @Body() updateContentDto: any) {
    return this.contentService.update(id, updateContentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('content/:id')
  @ApiOperation({ summary: 'Delete a content by ID' })
  @ApiResponse({ status: 200, description: 'The content has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Content not found.' })
  async delete(@Param('id') id: string) {
    return this.contentService.delete(id);
  }
}
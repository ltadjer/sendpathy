import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { TagService } from './tag.service'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'Return all tags.' })
  async findAll() {
    return this.tagService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return the tag.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async findOne(@Param('id') id: string) {
    return this.tagService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'The tag has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createTagDto: any) {
    return this.tagService.create(createTagDto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiResponse({ status: 200, description: 'The tag has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: any,
  ){
    return this.tagService.update(id, updateTagDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiResponse({ status: 200, description: 'The tag has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  async delete(@Param('id') id: string) {
    return this.tagService.delete(id)
  }

}

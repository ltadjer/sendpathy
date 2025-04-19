import { LifeMomentService } from './life-moment.service.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { User } from '../user/decorators/user.decorator.js';
import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { generateSlug} from '../utils/slug.utils.js'

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
  async findOne(@Param('id') id: string, @User() user: any) {
    return this.lifeMomentService.findOne(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a life moment by ID' })
  @ApiResponse({ status: 200, description: 'The life moment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Life moment not found.' })
  async update(@Param('id') id: string, @Body() updateLifeMomentDto: any, @User() user: any) {
    console.log('user', user);
    if (updateLifeMomentDto.contents && updateLifeMomentDto.contents.length > 0) {
      updateLifeMomentDto.contents = updateLifeMomentDto.contents.map(content => {
        // faire ça seulement si le content est nouveau (pas de id)
        if (!content.id && content.base64Content) {
          return {
            ...content,
            fileUrl: `data:${content.type};base64,${content.base64Content}`,
          };
        }
        return content;
      });
    }

    let slug = generateSlug(updateLifeMomentDto.content);
    slug = slug.substring(0, 50); // Limit the slug to 50 characters
    updateLifeMomentDto.slug = slug;
    return this.lifeMomentService.update(id, updateLifeMomentDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'The life moment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createLifeMomentDto: any, @User() user: any) {
    createLifeMomentDto.contents = createLifeMomentDto.contents.map(content => {
      return {
        ...content,
        fileUrl: content.base64Content,
      };
    });

    let slug = generateSlug(createLifeMomentDto.content);
    slug = slug.substring(0, 50); // Limit the slug to 50 characters
    createLifeMomentDto.slug = slug;
    return this.lifeMomentService.create(createLifeMomentDto, user.id);
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
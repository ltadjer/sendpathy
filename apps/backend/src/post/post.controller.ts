import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import slugify from 'slugify';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts.' })
  async findAll(@User() user: any) {
    return this.postService.findAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return the post.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async findOne(@Param('id') id: string,  @User() user: any) {
    return this.postService.findOne(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createPostDto: any, @User() user: any) {
    let slug = slugify(createPostDto.content, { lower: true });
    slug = slug.substring(0, 50); // Limit the slug to 50 characters
    createPostDto.slug = slug;
    return this.postService.create(createPostDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiResponse({ status: 200, description: 'The post has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: any,
  ){
    let slug = slugify(updatePostDto.content, { lower: true });
    slug = slug.substring(0, 50); // Limit the slug to 50 characters
    updatePostDto.slug = slug;
    return this.postService.update(id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({ status: 200, description: 'The post has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async delete(@Param('id') id: string) {
    return this.postService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/tags/:tagId')
  @ApiOperation({ summary: 'Add a tag to a post' })
  @ApiResponse({ status: 200, description: 'The tag has been successfully added to the post.' })
  @ApiResponse({ status: 404, description: 'Post or tag not found.' })
  async addTagToPost(@Param('postId') postId: string, @Param('tagId') tagId: string) {
    console.log('addTagToPost');
    return this.postService.addTagToPost(postId, tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId/tags/:tagId')
  @ApiOperation({ summary: 'Remove a tag from a post' })
  @ApiResponse({ status: 200, description: 'The tag has been successfully removed from the post.' })
  @ApiResponse({ status: 404, description: 'Post or tag not found.' })
  async removeTagFromPost(@Param('postId') postId: string, @Param('tagId') tagId: string) {
    return this.postService.removeTagFromPost(postId, tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/triggers/:triggerId')
  @ApiOperation({ summary: 'Add a trigger to a post' })
  @ApiResponse({ status: 200, description: 'The trigger has been successfully added to the post.' })
  @ApiResponse({ status: 404, description: 'Post or trigger not found.' })
  async addTriggerToPost(@Param('postId') postId: string, @Param('triggerId') triggerId: string) {
    return this.postService.addTriggerToPost(postId, triggerId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId/triggers/:triggerId')
  @ApiOperation({ summary: 'Remove a trigger from a post' })
  @ApiResponse({ status: 200, description: 'The trigger has been successfully removed from the post.' })
  @ApiResponse({ status: 404, description: 'Post or trigger not found.' })
  async removeTriggerFromPost(@Param('postId') postId: string, @Param('triggerId') triggerId: string) {
    return this.postService.removeTriggerFromPost(postId, triggerId);
  }
  
}

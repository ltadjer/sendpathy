import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { LikeService } from './like.service'
import { User } from 'src/user/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('likes')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all likes' })
  @ApiResponse({ status: 200, description: 'Return all likes.' })
  async findAll() {
    return this.likeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return the like.' })
  @ApiResponse({ status: 404, description: 'Like not found.' })
  async findOne(@Param('id') id: string) {
    return this.likeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('like/:postId')
  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully liked.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async likePost(@Param('postId') postId: string, @User() user: any) {
    return this.likeService.likePost(postId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unlike/:postId')
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({ status: 200, description: 'The post has been successfully unliked.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async unlikePost(@Param('postId') postId: string, @User() user: any) {
    return this.likeService.unlikePost(postId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('count/:postId')
  @ApiOperation({ summary: 'Count likes on a post' })
  @ApiResponse({ status: 200, description: 'Return the number of likes on the post.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async countPostLikes(@Param('postId') postId: string) {
    return this.likeService.countPostLikes(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('like/:commentId')
  @ApiOperation({ summary: 'Like a comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully liked.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async likeComment(@Param('commentId') commentId: string, @User() user: any) {
    return this.likeService.likeComment(commentId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unlike/:commentId')
  @ApiOperation({ summary: 'Unlike a comment' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully unliked.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async unlikeComment(@Param('commentId') commentId: string, @User() user: any) {
    return this.likeService.unlikeComment(commentId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('count/:commentId')
  @ApiOperation({ summary: 'Count likes on a comment' })
  @ApiResponse({ status: 200, description: 'Return the number of likes on the comment.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async countCommentLikes(@Param('commentId') commentId: string) {
    return this.likeService.countCommentLikes(commentId);
  }

}

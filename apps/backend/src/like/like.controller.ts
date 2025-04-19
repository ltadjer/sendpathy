import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { LikeService } from './like.service.js'
import { User } from '../user/decorators/user.decorator.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('likes')
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('like/post/:postId')
  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully liked.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async likePost(@Param('postId') postId: string, @User() user: any) {
    return this.likeService.likePost(postId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unlike/post/:postId')
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({ status: 200, description: 'The post has been successfully unliked.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async unlikePost(@Param('postId') postId: string, @User() user: any) {
    return this.likeService.unlikePost(postId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('like/comment/:commentId')
  @ApiOperation({ summary: 'Like a comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully liked.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async likeComment(@Param('commentId') commentId: string, @User() user: any) {
    return this.likeService.likeComment(commentId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unlike/comment/:commentId')
  @ApiOperation({ summary: 'Unlike a comment' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully unliked.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async unlikeComment(@Param('commentId') commentId: string, @User() user: any) {
    return this.likeService.unlikeComment(commentId, user.id);
  }

}

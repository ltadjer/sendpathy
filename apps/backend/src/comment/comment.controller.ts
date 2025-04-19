import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { CommentService } from './comment.service.js'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { User } from '../user/decorators/user.decorator.js';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('post/:postId')
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async addCommentToPost(@Param('postId') postId: string, @Body() createCommentDto: any, @User() user: any) {
    return this.commentService.addCommentToPost(postId, createCommentDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('post/:postId/:commentId')
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async removeCommentFromPost(@Param('postId') postId: string, @Param('commentId') commentId: string) {
    return this.commentService.removeCommentFromPost(postId, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('comment/:parentCommentId/replies')
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async addCommentToComment(@Param('parentCommentId') parentCommentId: string, @Body() createCommentDto: any, @User() user: any) {
    return this.commentService.addCommentToComment(parentCommentId, createCommentDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comment/:parentCommentId/replies/:commentId')
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async removeCommentFromComment(@Param('parentCommentId') parentCommentId: string, @Param('commentId') commentId: string) {
    return this.commentService.removeCommentFromComment(parentCommentId, commentId);
  }


}

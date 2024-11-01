import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { CommentService } from './comment.service'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/decorators/user.decorator';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'Return all comments.' })
  async findAll() {
    return this.commentService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return the comment.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async addCommentToPost(@Param('postId') postId: string, @Body() createCommentDto: any, @User() user: any) {
    return this.commentService.addCommentToPost(postId, createCommentDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId/:commentId')
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async removeCommentFromPost(@Param('postId') postId: string, @Param('commentId') commentId: string) {
    return this.commentService.removeCommentFromPost(postId, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':parentCommentId/replies')
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async addCommentToComment(@Param('parentCommentId') parentCommentId: string, @Body() createCommentDto: any, @User() user: any) {
    return this.commentService.addCommentToComment(parentCommentId, createCommentDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':parentCommentId/replies/:commentId')
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async removeCommentFromComment(@Param('parentCommentId') parentCommentId: string, @Param('commentId') commentId: string) {
    return this.commentService.removeCommentFromComment(parentCommentId, commentId);
  }


}

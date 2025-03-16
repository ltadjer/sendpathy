import { Controller, Get, Patch, Param, UseGuards, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all notifications for the logged-in user' })
  @ApiResponse({ status: 200, description: 'Return all notifications for the logged-in user.' })
  async fetchAll(@User() user: any) {
    return await this.notificationService.fetchAllNotifications(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async markAsRead(@Param('id') id: string) {
    return await this.notificationService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update notification message' })
  @ApiResponse({ status: 200, description: 'Notification message updated.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async updateNotificationMessage(@Param('id') id: string, @Body('message') message: string) {
    return await this.notificationService.updateNotificationMessage(id, message);
  }
}
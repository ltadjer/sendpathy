import { Injectable, Logger, UseGuards, Inject, forwardRef, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import { MessageService } from './message.service.js';
import { CustomSocket } from './dto/custom-socket.js';

@WebSocketGateway({ namespace: 'events' })
@UseGuards(JwtAuthGuard)
@Injectable()
export class MessageGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');

  constructor(
    @Inject(forwardRef(() => MessageService)) private readonly messageService: MessageService
  ) {}

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: CustomSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: CustomSocket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: CustomSocket, @MessageBody() payload: CreateMessageDto): Promise<void> {
    try {
      const user = client.user;
      if (!user) throw new UnauthorizedException('User not found');

      const message = await this.messageService.create(payload, user.id);
      console.log('message', message);
      this.server.emit('newMessage', message);
    } catch (error) {
      this.logger.error('Error handling message:', error);
      client.emit('exception', { status: 'error', message: 'Internal server error' });
    }
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(@ConnectedSocket() client: CustomSocket, @MessageBody() payload: { id: string, content: string }) {
    try {
      const user = client.user;
      if (!user) throw new UnauthorizedException('User not found');

      const updatedMessage = await this.messageService.update(payload.id, { content: payload.content }, user.id);
      console.log('updatedMessage', updatedMessage);
      this.server.emit('messageUpdated', updatedMessage);
    } catch (error) {
      this.logger.error('Error updating message:', error);
      client.emit('exception', { status: 'error', message: error.message || 'Internal server error' });
    }
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(@ConnectedSocket() client: CustomSocket, @MessageBody() payload: any): Promise<void> {
    try {
      const user = client.user;
      if (!user) throw new UnauthorizedException('User not found');

      await this.messageService.delete(payload.id);
      this.server.emit('messageDeleted', payload.id);
    } catch (error) {
      this.logger.error('Error deleting message:', error);
      client.emit('exception', { status: 'error', message: 'Internal server error' });
    }
  }

  @SubscribeMessage('deleteMessageForUser')
  async handleDeleteMessageForUser(@ConnectedSocket() client: CustomSocket, @MessageBody() payload: any): Promise<void> {
    try {
      const user = client.user;
      if (!user) throw new UnauthorizedException('User not found');

      await this.messageService.deleteForUser(payload.id, user.id);
      client.emit('messageDeletedForUser', payload.id);
    } catch (error) {
      this.logger.error('Error deleting message for user:', error);
      client.emit('exception', { status: 'error', message: 'Internal server error' });
    }
  }
}

import { Injectable, Logger, UseGuards, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { CustomSocket } from './dto/custom-socket';

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

  handleConnection(client: CustomSocket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: CustomSocket, @MessageBody() payload: CreateMessageDto): Promise<void> {
    try {
      const user = client.user;

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const message = await this.messageService.create(payload, user.id);
      this.server.to(user.id).to(payload.receiverId).emit('newMessage', message);
    } catch (error) {
      this.logger.error('Error handling message:', error);
      client.emit('exception', { status: 'error', message: 'Internal server error' });
    }
  }

  sendMessage(message: CreateMessageDto) {
    this.server.emit('newMessage', message);
  }
}
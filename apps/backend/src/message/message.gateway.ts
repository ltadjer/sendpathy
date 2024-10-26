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

  /**
   * Called after the WebSocket server is initialized.
   * @param server - The WebSocket server instance.
   */
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  /**
   * Handles client disconnection.
   * @param client - The disconnected client socket.
   */
  handleDisconnect(client: CustomSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Handles client connection.
   * @param client - The connected client socket.
   * @param args - Additional arguments.
   */
  handleConnection(client: CustomSocket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /**
   * Handles incoming messages from clients.
   * @param client - The client socket sending the message.
   * @param payload - The message payload.
   */
  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: CustomSocket, @MessageBody() payload: CreateMessageDto): Promise<void> {
    try {
      const user = client.user;
      console.log('user', user);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const message = await this.messageService.create(payload, user.id);
      this.server.emit('newMessage', message);
    } catch (error) {
      this.logger.error('Error handling message:', error);
      client.emit('exception', { status: 'error', message: 'Internal server error' });
    }
  }

  /**
   * Sends a message to all connected clients.
   * @param message - The message to send.
   */
  sendMessage(message: CreateMessageDto) {
    this.server.emit('newMessage', message);
  }
}
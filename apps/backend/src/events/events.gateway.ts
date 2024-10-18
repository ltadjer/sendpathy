import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ServerToClientEvents } from './types/events';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: 'events' })
@UseGuards(JwtAuthGuard)
export class EventsGateway {
  @WebSocketServer() server: Server<any, ServerToClientEvents>;

  /**
   * Lifecycle hook that is called after the gateway is initialized.
   * @param client - The client socket.
   */
  afterInit(client: Socket) {
    Logger.log('Init');
  }

  /**
   * Handles incoming messages from the client.
   * @param client - The client socket.
   * @param payload - The message payload.
   * @returns A response string.
   */
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  /**
   * Sends a new message to all connected clients.
   * @param message - The data transfer object containing the message details.
   */
  sendMessage(message: CreateMessageDto) {
    this.server.emit('newMessage', message);
  }
}
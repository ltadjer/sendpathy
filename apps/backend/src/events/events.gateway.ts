import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ServerToClientEvents } from './types/events';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import {CreateMessageDto} from "../message/dto/create-message.dto";

@WebSocketGateway({namespace: 'events'})
export class EventsGateway {

  @WebSocketServer() server: Server<any, ServerToClientEvents>;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  sendMessage(message: CreateMessageDto) {
    this.server.emit('newMessage', message);
  }
}

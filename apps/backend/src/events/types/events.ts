import {CreateMessageDto} from "../../message/dto/create-message.dto";

export interface ServerToClientEvents {
  newMessage: (payload: CreateMessageDto) => void;
}

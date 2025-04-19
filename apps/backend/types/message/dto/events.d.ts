import { CreateMessageDto } from "./create-message.dto";
export interface ServerToClientEvents {
    newMessage: (payload: CreateMessageDto) => void;
}

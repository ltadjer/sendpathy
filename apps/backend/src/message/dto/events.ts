import { CreateMessageDto } from "./create-message.dto";

/**
 * Interface defining the events sent from the server to the client.
 */
export interface ServerToClientEvents {
  /**
   * Event emitted when a new message is created.
   * @param payload - The data transfer object containing the message details.
   */
  newMessage: (payload: CreateMessageDto) => void;
}
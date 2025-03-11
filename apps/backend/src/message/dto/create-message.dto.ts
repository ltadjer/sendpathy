import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {

    @ApiProperty({ description: 'Receiver ID' })
    @IsString()
    @IsNotEmpty()
    receiverId: string;

    @ApiProperty({ description: 'Content of the message' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ description: 'Sender name' })
    @IsString()
    @IsNotEmpty()
    senderName: string;

    @ApiProperty({ description: 'Conversation ID' })
    @IsString()
    @IsNotEmpty()
    conversationId: string;

}
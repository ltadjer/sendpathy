import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({ description: 'Content of the post' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ description: 'Original language of the post' })
    @IsString()
    @IsNotEmpty()
    originalLanguage: string;

    @ApiProperty({ description: 'Slug for the post' })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ description: 'Emotion of the post' })
    @IsString()
    @IsNotEmpty()
    emotion: string;
}

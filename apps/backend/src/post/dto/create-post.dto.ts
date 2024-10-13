import { IsString, IsNotEmpty, IsNumber, IsOptional, IsJSON, IsDateString } from 'class-validator';
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
}
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsJSON, IsDateString } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsJSON()
    translatedContent?: object;

    @IsString()
    @IsNotEmpty()
    originalLanguage: string;

    @IsString()
    @IsNotEmpty()
    slug: string;
}
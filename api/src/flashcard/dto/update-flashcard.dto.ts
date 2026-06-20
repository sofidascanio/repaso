import {
    IsString,
    IsOptional,
    IsArray,
    IsBoolean,
    MinLength,
    MaxLength,
} from 'class-validator';

export class UpdateFlashcardDto {
    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(1000)
    question?: string;

    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(2000)
    answer?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsBoolean()
    @IsOptional()
    isFavorite?: boolean;

    @IsBoolean()
    @IsOptional()
    isDifficult?: boolean;
}
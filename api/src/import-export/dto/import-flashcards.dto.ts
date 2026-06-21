import { IsArray, IsString, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ImportFlashcardItemDto {
    @ApiProperty({ example: '¿Cuál es la capital de Francia?' })
    @IsString()
    question!: string;

    @ApiProperty({ example: 'París' })
    @IsString()
    answer!: string;

    @ApiProperty({ example: ['geografía', 'europa'], required: false })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    isFavorite?: boolean;

    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    isDifficult?: boolean;
}

export class ImportFlashcardsDto {
    @ApiProperty({ type: [ImportFlashcardItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImportFlashcardItemDto)
    flashcards!: ImportFlashcardItemDto[];
}
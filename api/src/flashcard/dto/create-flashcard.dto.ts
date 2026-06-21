import {
    IsString,
    IsOptional,
    IsArray,
    IsBoolean,
    MinLength,
    MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFlashcardDto {
    @ApiProperty({ example: '¿Cuál es la capital de Francia?' })
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    question!: string;

    @ApiProperty({ example: 'París' })
    @IsString()
    @MinLength(1)
    @MaxLength(2000)
    answer!: string;

    @ApiProperty({ example: ['geografía', 'europa'], required: false })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isFavorite?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    isDifficult?: boolean;
}
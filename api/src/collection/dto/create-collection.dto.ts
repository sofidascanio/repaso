import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateCollectionDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name!: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;

    @IsString()
    @IsOptional()
    iconEmoji?: string;
}
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'Juan Lopez', minLength: 2, maxLength: 100 })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name!: string;

    @ApiProperty({ example: 'juan@universidad.edu' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'miPassword123', minLength: 8, maxLength: 100 })
    @IsString()
    @MinLength(8)
    @MaxLength(100)
    password!: string;
}
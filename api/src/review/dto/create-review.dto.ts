import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewResult } from '@prisma/client';

export class CreateReviewDto {
    @ApiProperty({
        enum: ReviewResult,
        example: ReviewResult.GOOD,
        description: 'AGAIN = no lo recorde, HARD = con esfuerzo, GOOD = bien, EASY = fácil',
    })
    @IsEnum(ReviewResult)
    result!: ReviewResult;
}
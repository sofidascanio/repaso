import { IsEnum } from 'class-validator';
import { ReviewResult } from '@prisma/client';

export class CreateReviewDto {
    @IsEnum(ReviewResult)
    result!: ReviewResult;
}
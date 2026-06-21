import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ParseCuidPipe } from '@/common/pipes/parse-cuid.pipe';

@Controller()
@UseGuards(JwtAuthGuard)
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post('flashcards/:id/review')
    review(
        @Param('id', ParseCuidPipe) id: string,
        @Body() dto: CreateReviewDto,
        @CurrentUser() user: User,
    ) {
        return this.reviewService.review(id, user.id, dto);
    }

    @Get('collections/:collectionId/due')
    getDue(
        @Param('collectionId', ParseCuidPipe) collectionId: string,
        @CurrentUser() user: User,
    ) {
        return this.reviewService.getDueFlashcards(collectionId, user.id);
    }
}
import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ParseCuidPipe } from '@/common/pipes/parse-cuid.pipe';

@ApiTags('Reviews')
@ApiBearerAuth('access-token')
@Controller()
@UseGuards(JwtAuthGuard)
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @ApiOperation({ summary: 'Registrar resultado de repaso' })
    @Post('flashcards/:id/review')
    review(
        @Param('id', ParseCuidPipe) id: string,
        @Body() dto: CreateReviewDto,
        @CurrentUser() user: User,
    ) {
        return this.reviewService.review(id, user.id, dto);
    }

    @ApiOperation({ summary: 'Listar flashcards pendientes de repaso hoy' })
    @Get('collections/:collectionId/due')
    getDue(
        @Param('collectionId', ParseCuidPipe) collectionId: string,
        @CurrentUser() user: User,
    ) {
        return this.reviewService.getDueFlashcards(collectionId, user.id);
    }
}
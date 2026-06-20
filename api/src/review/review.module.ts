import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { SM2Service } from './sm2.service';
import { FlashcardModule } from '@/flashcard/flashcard.module';
import { CollectionModule } from '@/collection/collection.module';

@Module({
    imports: [FlashcardModule, CollectionModule],
    controllers: [ReviewController],
    providers: [ReviewService, SM2Service],
    exports: [ReviewService],
})
export class ReviewModule {}
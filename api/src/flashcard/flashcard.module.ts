import { Module } from '@nestjs/common';
import { FlashcardController } from './flashcard.controller';
import { FlashcardService } from './flashcard.service';
import { CollectionModule } from '@/collection/collection.module';

@Module({
    imports: [CollectionModule],
    controllers: [FlashcardController],
    providers: [FlashcardService],
    exports: [FlashcardService],
})
export class FlashcardModule {}
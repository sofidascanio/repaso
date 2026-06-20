import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard)
export class FlashcardController {
    constructor(private readonly flashcardService: FlashcardService) {}

    @Get('collections/:collectionId/flashcards')
    findAll(
        @Param('collectionId') collectionId: string,
        @CurrentUser() user: User,
    ) {
        return this.flashcardService.findAll(collectionId, user.id);
    }

    @Get('collections/:collectionId/flashcards/study')
    findForStudy(
        @Param('collectionId') collectionId: string,
        @CurrentUser() user: User,
    ) {
        return this.flashcardService.findForStudy(collectionId, user.id);
    }

    @Post('collections/:collectionId/flashcards')
    create(
        @Param('collectionId') collectionId: string,
        @Body() dto: CreateFlashcardDto,
        @CurrentUser() user: User,
    ) {
        return this.flashcardService.create(collectionId, user.id, dto);
    }

    @Get('flashcards/:id')
    findOne(@Param('id') id: string, @CurrentUser() user: User) {
        return this.flashcardService.findOne(id, user.id);
    }

    @Patch('flashcards/:id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateFlashcardDto,
        @CurrentUser() user: User,
    ) {
        return this.flashcardService.update(id, user.id, dto);
    }

    @Delete('flashcards/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string, @CurrentUser() user: User) {
        return this.flashcardService.remove(id, user.id);
    }
}
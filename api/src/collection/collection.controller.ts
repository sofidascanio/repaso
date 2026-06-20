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
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard)
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

    @Get('projects/:projectId/collections')
    findAll(
        @Param('projectId') projectId: string,
        @CurrentUser() user: User,
    ) {
        return this.collectionService.findAll(projectId, user.id);
    }

    @Post('projects/:projectId/collections')
    create(
        @Param('projectId') projectId: string,
        @Body() dto: CreateCollectionDto,
        @CurrentUser() user: User,
    ) {
        return this.collectionService.create(projectId, user.id, dto);
    }

    @Get('collections/:id')
    findOne(@Param('id') id: string, @CurrentUser() user: User) {
        return this.collectionService.findOne(id, user.id);
    }

    @Patch('collections/:id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateCollectionDto,
        @CurrentUser() user: User,
    ) {
        return this.collectionService.update(id, user.id, dto);
    }

    @Delete('collections/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string, @CurrentUser() user: User) {
        return this.collectionService.remove(id, user.id);
    }
}
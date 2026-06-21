import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('Search')
@ApiBearerAuth('access-token')
@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @ApiOperation({ summary: 'Búsqueda global en workspaces, projects, collections y flashcards' })
    @ApiQuery({ name: 'q', description: 'Término de búsqueda (mínimo 2 caracteres)', required: true })
    @Get()
    search(@Query('q') query: string = '', @CurrentUser() user: User) {
        return this.searchService.search(query, user.id);
    }
}
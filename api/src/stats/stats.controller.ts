import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ParseCuidPipe } from '@/common/pipes/parse-cuid.pipe';

@ApiTags('Stats')
@ApiBearerAuth('access-token')
@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    @ApiOperation({ summary: 'Resumen general del usuario' })
    @Get('overview')
    getOverview(@CurrentUser() user: User) {
        return this.statsService.getOverview(user.id);
    }

    @ApiOperation({ summary: 'Estadísticas de una collection' })
    @Get('collection/:id')
    getCollection(
        @Param('id', ParseCuidPipe) id: string,
        @CurrentUser() user: User,
    ) {
        return this.statsService.getCollectionStats(id, user.id);
    }
}
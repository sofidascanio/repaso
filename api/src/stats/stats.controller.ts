import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ParseCuidPipe } from '@/common/pipes/parse-cuid.pipe';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    @Get('overview')
    getOverview(@CurrentUser() user: User) {
        return this.statsService.getOverview(user.id);
    }

    @Get('collection/:id')
    getCollection(
        @Param('id', ParseCuidPipe) id: string,
        @CurrentUser() user: User,
    ) {
        return this.statsService.getCollectionStats(id, user.id);
    }
}
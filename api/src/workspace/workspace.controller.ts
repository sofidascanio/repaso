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
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ParseCuidPipe } from '@/common/pipes/parse-cuid.pipe';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) {}

    @Get()
    findAll(@CurrentUser() user: User) {
        return this.workspaceService.findAll(user.id);
    }

    @Get(':id')
    findOne(@Param('id', ParseCuidPipe) id: string, @CurrentUser() user: User) {
        return this.workspaceService.findOne(id, user.id);
    }

    @Post()
    create(@Body() dto: CreateWorkspaceDto, @CurrentUser() user: User) {
        return this.workspaceService.create(user.id, dto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseCuidPipe) id: string,
        @Body() dto: UpdateWorkspaceDto,
        @CurrentUser() user: User,
    ) {
        return this.workspaceService.update(id, user.id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseCuidPipe) id: string, @CurrentUser() user: User) {
        return this.workspaceService.remove(id, user.id);
    }
}
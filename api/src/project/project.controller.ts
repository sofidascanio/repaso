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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ParseCuidPipe } from '@/common/pipes/parse-cuid.pipe';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Get('workspaces/:workspaceId/projects')
    findAll(
        @Param('workspaceId', ParseCuidPipe) workspaceId: string,
        @CurrentUser() user: User,
    ) {
        return this.projectService.findAll(workspaceId, user.id);
    }

    @Post('workspaces/:workspaceId/projects')
    create(
        @Param('workspaceId', ParseCuidPipe) workspaceId: string,
        @Body() dto: CreateProjectDto,
        @CurrentUser() user: User,
    ) {
        return this.projectService.create(workspaceId, user.id, dto);
    }

    @Get('projects/:id')
    findOne(@Param('id', ParseCuidPipe) id: string, @CurrentUser() user: User) {
        return this.projectService.findOne(id, user.id);
    }

    @Patch('projects/:id')
    update(
        @Param('id', ParseCuidPipe) id: string,
        @Body() dto: UpdateProjectDto,
        @CurrentUser() user: User,
    ) {
        return this.projectService.update(id, user.id, dto);
    }

    @Delete('projects/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseCuidPipe) id: string, @CurrentUser() user: User) {
        return this.projectService.remove(id, user.id);
    }
}
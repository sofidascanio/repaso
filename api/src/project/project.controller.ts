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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ParseCuidPipe } from '@/common/pipes/parse-cuid.pipe';

@ApiTags('Projects')
@ApiBearerAuth('access-token')
@Controller()
@UseGuards(JwtAuthGuard)
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @ApiOperation({ summary: 'Listar projects de un workspace' })
    @Get('workspaces/:workspaceId/projects')
    findAll(
        @Param('workspaceId', ParseCuidPipe) workspaceId: string,
        @CurrentUser() user: User,
    ) {
        return this.projectService.findAll(workspaceId, user.id);
    }

    @ApiOperation({ summary: 'Crear project en un workspace' })
    @Post('workspaces/:workspaceId/projects')
    create(
        @Param('workspaceId', ParseCuidPipe) workspaceId: string,
        @Body() dto: CreateProjectDto,
        @CurrentUser() user: User,
    ) {
        return this.projectService.create(workspaceId, user.id, dto);
    }

    @ApiOperation({ summary: 'Obtener project por ID' })
    @Get('projects/:id')
    findOne(@Param('id', ParseCuidPipe) id: string, @CurrentUser() user: User) {
        return this.projectService.findOne(id, user.id);
    }

    @ApiOperation({ summary: 'Actualizar project' })
    @Patch('projects/:id')
    update(
        @Param('id', ParseCuidPipe) id: string,
        @Body() dto: UpdateProjectDto,
        @CurrentUser() user: User,
    ) {
        return this.projectService.update(id, user.id, dto);
    }

    @ApiOperation({ summary: 'Eliminar project' })
    @Delete('projects/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseCuidPipe) id: string, @CurrentUser() user: User) {
        return this.projectService.remove(id, user.id);
    }
}
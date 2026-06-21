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
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { ParseCuidPipe } from '@/common/pipes/parse-cuid.pipe';

@ApiTags('Collections')
@ApiBearerAuth('access-token')
@Controller()
@UseGuards(JwtAuthGuard)
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {}

    @ApiOperation({ summary: 'Listar collections de un project' })
    @Get('projects/:projectId/collections')
    findAll(
        @Param('projectId', ParseCuidPipe) projectId: string,
        @CurrentUser() user: User,
    ) {
        return this.collectionService.findAll(projectId, user.id);
    }

    @ApiOperation({ summary: 'Crear collection en un project' })
    @Post('projects/:projectId/collections')
    create(
        @Param('projectId', ParseCuidPipe) projectId: string,
        @Body() dto: CreateCollectionDto,
        @CurrentUser() user: User,
    ) {
        return this.collectionService.create(projectId, user.id, dto);
    }

    @ApiOperation({ summary: 'Obtener collection por ID' })
    @Get('collections/:id')
    findOne(@Param('id', ParseCuidPipe) id: string, @CurrentUser() user: User) {
        return this.collectionService.findOne(id, user.id);
    }

    @ApiOperation({ summary: 'Actualizar collection' })
    @Patch('collections/:id')
    update(
        @Param('id', ParseCuidPipe) id: string,
        @Body() dto: UpdateCollectionDto,
        @CurrentUser() user: User,
    ) {
        return this.collectionService.update(id, user.id, dto);
    }

    @ApiOperation({ summary: 'Eliminar collection' })
    @Delete('collections/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseCuidPipe) id: string, @CurrentUser() user: User) {
        return this.collectionService.remove(id, user.id);
    }
}
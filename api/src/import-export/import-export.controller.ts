import {
    Controller,
    Get,
    Post,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Res,
    BadRequestException,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type  { Response } from 'express';
import { memoryStorage } from 'multer';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { ImportExportService } from './import-export.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ParseCuidPipe } from '@/common/pipes/parse-cuid.pipe';
import type { User } from '@prisma/client';

@ApiTags('Import / Export')
@ApiBearerAuth('access-token')
@Controller()
@UseGuards(JwtAuthGuard)
export class ImportExportController {
    constructor(private readonly importExportService: ImportExportService) {}

    // export 
    @ApiOperation({ summary: 'Exportar flashcards de una collection como JSON' })
    @Get('collections/:id/export/json')
    async exportJson(
        @Param('id', ParseCuidPipe) id: string,
        @CurrentUser() user: User,
        @Res() res: Response,
    ) {
        const result = await this.importExportService.exportJson(id, user.id);

        res.setHeader('Content-Type', result.mimeType);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${result.filename}"`,
        );
        res.send(result.content);
    }

    @ApiOperation({ summary: 'Exportar flashcards de una collection como CSV' })
    @Get('collections/:id/export/csv')
    async exportCsv(
        @Param('id', ParseCuidPipe) id: string,
        @CurrentUser() user: User,
        @Res() res: Response,
    ) {
        const result = await this.importExportService.exportCsv(id, user.id);

        res.setHeader('Content-Type', result.mimeType);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${result.filename}"`,
        );
        res.send(result.content);
    }

    // import 
    @ApiOperation({ summary: 'Importar flashcards desde un archivo JSON' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @Post('collections/:id/import/json')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
            fileFilter: (_req, file, cb) => {
                if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException('Solo se permiten archivos .json'), false);
                }
            },
        }),
    )
    async importJson(
        @Param('id', ParseCuidPipe) id: string,
        @CurrentUser() user: User,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException('No se recibió ningún archivo');
        return this.importExportService.importJson(id, user.id, file.buffer);
    }

    @ApiOperation({ summary: 'Importar flashcards desde un archivo CSV' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    @Post('collections/:id/import/csv')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
            fileFilter: (_req, file, cb) => {
                if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException('Solo se permiten archivos .csv'), false);
                }
            },
        }),
    )
    async importCsv(
        @Param('id', ParseCuidPipe) id: string,
        @CurrentUser() user: User,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException('No se recibió ningún archivo');
        return this.importExportService.importCsv(id, user.id, file.buffer);
    }
}
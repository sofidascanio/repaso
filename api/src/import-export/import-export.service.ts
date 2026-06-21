import { Injectable, BadRequestException, } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CollectionService } from '@/collection/collection.service';
import { ImportFlashcardItemDto } from './dto/import-flashcards.dto';
import { Flashcard } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

export interface ExportResult {
    filename: string;
    content: string;
    mimeType: string;
}

export interface ImportResult {
    imported: number;
    skipped: number;
    errors: string[];
}

@Injectable()
export class ImportExportService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly collectionService: CollectionService,
    ) {}

    // export json 
    async exportJson(
        collectionId: string,
        userId: string,
    ): Promise<ExportResult> {
        const collection = await this.collectionService.findOne(
            collectionId,
            userId,
        );

        const flashcards = await this.prisma.flashcard.findMany({
            where: { collectionId, deletedAt: null },
            orderBy: { createdAt: 'asc' },
            select: {
                question: true,
                answer: true,
                tags: true,
                isFavorite: true,
                isDifficult: true,
            },
        });

        const payload = {
            collection: {
                name: collection.name,
                description: collection.description,
                exportedAt: new Date().toISOString(),
                totalCards: flashcards.length,
            },
            flashcards,
        };

        return {
            filename: `${this.slugify(collection.name)}-${Date.now()}.json`,
            content: JSON.stringify(payload, null, 2),
            mimeType: 'application/json',
        };
    }

    // export csv 
    async exportCsv(
        collectionId: string,
        userId: string,
    ): Promise<ExportResult> {
        const collection = await this.collectionService.findOne(
            collectionId,
            userId,
        );

        const flashcards = await this.prisma.flashcard.findMany({
            where: { collectionId, deletedAt: null },
            orderBy: { createdAt: 'asc' },
            select: {
                question: true,
                answer: true,
                tags: true,
                isFavorite: true,
                isDifficult: true,
            },
        });

        const rows = flashcards.map((f) => ({
            question: f.question,
            answer: f.answer,
            tags: f.tags.join('|'),
            isFavorite: f.isFavorite ? '1' : '0',
            isDifficult: f.isDifficult ? '1' : '0',
        }));

        const content = stringify(rows, {
            header: true,
            columns: ['question', 'answer', 'tags', 'isFavorite', 'isDifficult'],
        });

        return {
            filename: `${this.slugify(collection.name)}-${Date.now()}.csv`,
            content,
            mimeType: 'text/csv',
        };
    }

    // import json 
    async importJson(
        collectionId: string,
        userId: string,
        fileBuffer: Buffer,
    ): Promise<ImportResult> {
        await this.collectionService.findOne(collectionId, userId);

        let parsed: { flashcards: ImportFlashcardItemDto[] };

        try {
            const raw = JSON.parse(fileBuffer.toString('utf-8'));
            // soportat tanto el formato de export como un array directo
            parsed = Array.isArray(raw) ? { flashcards: raw } : raw;
        } catch {
            throw new BadRequestException('El archivo JSON no es válido');
        }

        if (!Array.isArray(parsed.flashcards)) {
            throw new BadRequestException(
                'El JSON debe contener un array "flashcards"',
            );
        }

        return this.importItems(collectionId, parsed.flashcards);
    }

    // import csv 
    async importCsv(
        collectionId: string,
        userId: string,
        fileBuffer: Buffer,
    ): Promise<ImportResult> {
        await this.collectionService.findOne(collectionId, userId);

        let rows: Record<string, string>[];

        try {
            rows = parse(fileBuffer.toString('utf-8'), {
                columns: true,
                skip_empty_lines: true,
                trim: true,
            });
        } catch {
            throw new BadRequestException('El archivo CSV no es válido');
        }

        const items: ImportFlashcardItemDto[] = rows.map((row) => ({
            question: row.question ?? '',
            answer: row.answer ?? '',
            tags: row.tags ? row.tags.split('|').map((t) => t.trim()).filter(Boolean) : [],
            isFavorite: row.isFavorite === '1' || row.isFavorite === 'true',
            isDifficult: row.isDifficult === '1' || row.isDifficult === 'true',
        }));

        return this.importItems(collectionId, items);
    }

    // helper para importar items validados
    private async importItems(
        collectionId: string,
        items: ImportFlashcardItemDto[],
    ): Promise<ImportResult> {
        let imported = 0;
        let skipped = 0;
        const errors: string[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const rowLabel = `Fila ${i + 1}`;

            if (!item.question?.trim()) {
                errors.push(`${rowLabel}: falta la pregunta`);
                skipped++;
                continue;
            }

            if (!item.answer?.trim()) {
                errors.push(`${rowLabel}: falta la respuesta`);
                skipped++;
                continue;
            }

            try {
                await this.prisma.flashcard.create({
                    data: {
                        question: item.question.trim(),
                        answer: item.answer.trim(),
                        tags: item.tags ?? [],
                        isFavorite: item.isFavorite ?? false,
                        isDifficult: item.isDifficult ?? false,
                        collectionId,
                    },
                });
                imported++;
            } catch {
                errors.push(`${rowLabel}: error al guardar`);
                skipped++;
            }
        }

        return { imported, skipped, errors };
    }

    // helper 
    private slugify(text: string): string {
        return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
}
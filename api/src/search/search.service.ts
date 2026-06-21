import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

export interface SearchResults {
    workspaces: {
        id: string;
        name: string;
        description: string | null;
        iconEmoji: string | null;
    }[];
    projects: {
        id: string;
        name: string;
        description: string | null;
        iconEmoji: string | null;
        workspaceId: string;
    }[];
    collections: {
        id: string;
        name: string;
        description: string | null;
        iconEmoji: string | null;
        projectId: string;
        workspaceId: string;
    }[];
    flashcards: {
        id: string;
        question: string;
        answer: string;
        tags: string[];
        collectionId: string;
        projectId: string;
        workspaceId: string;
    }[];
    total: number;
}

@Injectable()
export class SearchService {
    constructor(private readonly prisma: PrismaService) {}

    async search(query: string, userId: string): Promise<SearchResults> {
        if (!query || query.trim().length < 2) {
            return {
                workspaces: [],
                projects: [],
                collections: [],
                flashcards: [],
                total: 0,
            };
        }

        const q = query.trim().toLowerCase();

        const [workspaces, projects, collections, flashcards] = await Promise.all([
            this.searchWorkspaces(q, userId),
            this.searchProjects(q, userId),
            this.searchCollections(q, userId),
            this.searchFlashcards(q, userId),
        ]);

        return {
            workspaces,
            projects,
            collections,
            flashcards,
            total: workspaces.length +
                projects.length +
                collections.length +
                flashcards.length,
        };
    }

    private async searchWorkspaces(query: string, userId: string) {
        const results = await this.prisma.workspace.findMany({
            where: {
                userId,
                deletedAt: null,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                name: true,
                description: true,
                iconEmoji: true,
            },
            take: 5,
        });

        return results;
    }

    private async searchProjects(query: string, userId: string) {
        const results = await this.prisma.project.findMany({
            where: {
                deletedAt: null,
                workspace: { userId, deletedAt: null },
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                name: true,
                description: true,
                iconEmoji: true,
                workspaceId: true,
            },
            take: 5,
        });

        return results;
    }

    private async searchCollections(query: string, userId: string) {
        const results = await this.prisma.collection.findMany({
            where: {
                deletedAt: null,
                project: {
                    deletedAt: null,
                    workspace: { userId, deletedAt: null },
                },
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                name: true,
                description: true,
                iconEmoji: true,
                projectId: true,
                project: {
                    select: { workspaceId: true },
                },
            },
            take: 5,
        });

        return results.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            iconEmoji: c.iconEmoji,
            projectId: c.projectId,
            workspaceId: c.project.workspaceId,
        }));
    }

    private async searchFlashcards(query: string, userId: string) {
        const results = await this.prisma.flashcard.findMany({
            where: {
                deletedAt: null,
                collection: {
                    deletedAt: null,
                    project: {
                        deletedAt: null,
                        workspace: { userId, deletedAt: null },
                    },
                },
                OR: [
                    { question: { contains: query, mode: 'insensitive' } },
                    { answer: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query } },
                ],
            },
            select: {
                id: true,
                question: true,
                answer: true,
                tags: true,
                collectionId: true,
                collection: {
                    select: {
                        projectId: true,
                        project: {
                        select: { workspaceId: true },
                        },
                    },
                },
            },
            take: 10,
        });

        return results.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            tags: f.tags,
            collectionId: f.collectionId,
            projectId: f.collection.projectId,
            workspaceId: f.collection.project.workspaceId,
        }));
    }
}
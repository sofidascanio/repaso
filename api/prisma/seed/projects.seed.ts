import { PrismaClient } from '@prisma/client';
import { SeededWorkspaces } from './workspaces.seed';

export interface SeededProjects {
    matematica: { id: string };
    historia: { id: string };
    ingles: { id: string };
    frances: { id: string };
    backend: { id: string };
    frontend: { id: string };
}

export async function seedProjects(
    prisma: PrismaClient,
    workspaces: SeededWorkspaces,
): Promise<SeededProjects> {
    console.log('  → Creando projects...');

    const matematica = await prisma.project.create({
        data: {
            name: 'Matemática',
            description: 'Álgebra, cálculo y estadística',
            iconEmoji: 'calculator',
            workspaceId: workspaces.universidad.id,
        },
    });

    const historia = await prisma.project.create({
        data: {
            name: 'Historia',
            description: 'Historia universal y argentina',
            iconEmoji: 'book',
            workspaceId: workspaces.universidad.id,
        },
    });

    const ingles = await prisma.project.create({
        data: {
            name: 'Inglés',
            description: 'Gramática y vocabulario nivel B2',
            iconEmoji: 'globe',
            workspaceId: workspaces.idiomas.id,
        },
    });

    const frances = await prisma.project.create({
        data: {
            name: 'Francés',
            description: 'Nivel inicial A1-A2',
            iconEmoji: 'globe',
            workspaceId: workspaces.idiomas.id,
        },
    });

    const backend = await prisma.project.create({
        data: {
            name: 'Backend',
            description: 'Node.js, NestJS, bases de datos',
            iconEmoji: 'code',
            workspaceId: workspaces.programacion.id,
        },
    });

    const frontend = await prisma.project.create({
        data: {
            name: 'Frontend',
            description: 'React, Next.js, CSS',
            iconEmoji: 'laptop',
            workspaceId: workspaces.programacion.id,
        },
    });

    console.log(`     ✓ ${matematica.name}`);
    console.log(`     ✓ ${historia.name}`);
    console.log(`     ✓ ${ingles.name}`);
    console.log(`     ✓ ${frances.name}`);
    console.log(`     ✓ ${backend.name}`);
    console.log(`     ✓ ${frontend.name}`);

    return {
        matematica: { id: matematica.id },
        historia: { id: historia.id },
        ingles: { id: ingles.id },
        frances: { id: frances.id },
        backend: { id: backend.id },
        frontend: { id: frontend.id },
    };
}
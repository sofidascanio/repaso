import { PrismaClient } from '@prisma/client';
import { SeededProjects } from './projects.seed';

export interface SeededCollections {
    algebra: { id: string };
    calculo: { id: string };
    historiaModerna: { id: string };
    verbosIrregulares: { id: string };
    vocabularioB2: { id: string };
    saludos: { id: string };
    nodeJs: { id: string };
    reactHooks: { id: string };
}

export async function seedCollections(
    prisma: PrismaClient,
    projects: SeededProjects,
): Promise<SeededCollections> {
    console.log('  → Creando collections...');

    const algebra = await prisma.collection.create({
        data: {
            name: 'Álgebra',
            description: 'Ecuaciones, matrices y vectores',
            iconEmoji: 'calculator',
            projectId: projects.matematica.id,
        },
    });

    const calculo = await prisma.collection.create({
        data: {
            name: 'Cálculo',
            description: 'Límites, derivadas e integrales',
            iconEmoji: 'calculator',
            projectId: projects.matematica.id,
        },
    });

    const historiaModerna = await prisma.collection.create({
        data: {
            name: 'Historia Moderna',
            description: 'Siglos XV al XVIII',
            iconEmoji: 'book',
            projectId: projects.historia.id,
        },
    });

    const verbosIrregulares = await prisma.collection.create({
        data: {
            name: 'Verbos Irregulares',
            description: 'Los 100 verbos irregulares más comunes',
            iconEmoji: 'pencil',
            projectId: projects.ingles.id,
        },
    });

    const vocabularioB2 = await prisma.collection.create({
        data: {
            name: 'Vocabulario B2',
            description: 'Palabras avanzadas para el nivel B2',
            iconEmoji: 'book-open',
            projectId: projects.ingles.id,
        },
    });

    const saludos = await prisma.collection.create({
        data: {
            name: 'Saludos y presentaciones',
            description: 'Frases básicas para presentarse',
            iconEmoji: 'star',
            projectId: projects.frances.id,
        },
    });

    const nodeJs = await prisma.collection.create({
        data: {
            name: 'Node.js Fundamentos',
            description: 'Event loop, módulos, streams',
            iconEmoji: 'code',
            projectId: projects.backend.id,
        },
    });

    const reactHooks = await prisma.collection.create({
        data: {
            name: 'React Hooks',
            description: 'useState, useEffect, useCallback y más',
            iconEmoji: 'atom',
            projectId: projects.frontend.id,
        },
    });

    console.log(`     ✓ ${algebra.name}`);
    console.log(`     ✓ ${calculo.name}`);
    console.log(`     ✓ ${historiaModerna.name}`);
    console.log(`     ✓ ${verbosIrregulares.name}`);
    console.log(`     ✓ ${vocabularioB2.name}`);
    console.log(`     ✓ ${saludos.name}`);
    console.log(`     ✓ ${nodeJs.name}`);
    console.log(`     ✓ ${reactHooks.name}`);

    return {
        algebra: { id: algebra.id },
        calculo: { id: calculo.id },
        historiaModerna: { id: historiaModerna.id },
        verbosIrregulares: { id: verbosIrregulares.id },
        vocabularioB2: { id: vocabularioB2.id },
        saludos: { id: saludos.id },
        nodeJs: { id: nodeJs.id },
        reactHooks: { id: reactHooks.id },
    };
}
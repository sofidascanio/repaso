import { PrismaClient } from '@prisma/client';
import { SeededUsers } from './users.seed';

export interface SeededWorkspaces {
    universidad: { id: string };
    idiomas: { id: string };
    programacion: { id: string };
}

export async function seedWorkspaces(
    prisma: PrismaClient,
    users: SeededUsers,
): Promise<SeededWorkspaces> {
    console.log('  → Creando workspaces...');

    const universidad = await prisma.workspace.create({
        data: {
            name: 'Universidad',
            description: 'Materias del ciclo universitario',
            iconEmoji: 'graduation-cap',
            userId: users.sofia.id,
        },
    });

    const idiomas = await prisma.workspace.create({
        data: {
            name: 'Idiomas',
            description: 'Inglés, francés y portugués',
            iconEmoji: 'translate',
            userId: users.sofia.id,
        },
    });

    const programacion = await prisma.workspace.create({
        data: {
            name: 'Programación',
            description: 'Conceptos de desarrollo de software',
            iconEmoji: 'code',
            userId: users.matias.id,
        },
    });

    console.log(`     ✓ ${universidad.name}`);
    console.log(`     ✓ ${idiomas.name}`);
    console.log(`     ✓ ${programacion.name}`);

    return {
        universidad: { id: universidad.id },
        idiomas: { id: idiomas.id },
        programacion: { id: programacion.id },
    };
}
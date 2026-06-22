import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface SeededUsers {
    sofia: { id: string; email: string };
    matias: { id: string; email: string };
}

export async function seedUsers(prisma: PrismaClient): Promise<SeededUsers> {
    console.log('  → Creando usuarios...');

    const passwordHash = await bcrypt.hash('password123', 12);

    const sofia = await prisma.user.upsert({
        where: { email: 'sofia@repaso.dev' },
        update: {},
        create: {
            name: 'Sofía García',
            email: 'sofia@repaso.dev',
            passwordHash,
            avatarUrl: null,
        },
    });

    const matias = await prisma.user.upsert({
        where: { email: 'matias@repaso.dev' },
        update: {},
        create: {
            name: 'Matías López',
            email: 'matias@repaso.dev',
            passwordHash,
            avatarUrl: null,
        },
    });

    console.log(`     ✓ ${sofia.name} (${sofia.email})`);
    console.log(`     ✓ ${matias.name} (${matias.email})`);

    return {
        sofia: { id: sofia.id, email: sofia.email },
        matias: { id: matias.id, email: matias.email },
    };
}
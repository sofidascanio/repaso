import { PrismaClient } from '@prisma/client';
import { seedUsers } from './users.seed';
import { seedWorkspaces } from './workspaces.seed';
import { seedProjects } from './projects.seed';
import { seedCollections } from './collections.seed';
import { seedFlashcards } from './flashcards.seed';
import { seedReviews } from './reviews.seed';

const prisma = new PrismaClient();

async function main() {
    console.log('\n Iniciando seed de Repaso...\n');

    // limpia datos existentes 
    console.log(' Limpiando datos existentes...');
    await prisma.reviewLog.deleteMany();
    await prisma.flashcard.deleteMany();
    await prisma.collection.deleteMany();
    await prisma.project.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();
    console.log('   ✓ Datos eliminados\n');

    // seed en orden
    console.log(' * Usuarios');
    const users = await seedUsers(prisma);

    console.log('\n * Workspaces');
    const workspaces = await seedWorkspaces(prisma, users);

    console.log('\n * Projects');
    const projects = await seedProjects(prisma, workspaces);

    console.log('\n *  Collections');
    const collections = await seedCollections(prisma, projects);

    console.log('\n * Flashcards');
    const flashcards = await seedFlashcards(prisma, collections);

    console.log('\n * Reviews');
    await seedReviews(prisma, users, flashcards);

    // Resumen 
    console.log('\n Seed completado exitosamente!\n');
    console.log('─'.repeat(10));
    console.log(' Credenciales de prueba:');
    console.log('');
    console.log('   Usuario 1:');
    console.log(`   Email:    sofia@repaso.dev`);
    console.log(`   Password: password123`);
    console.log('');
    console.log('   Usuario 2:');
    console.log(`   Email:    matias@repaso.dev`);
    console.log(`   Password: password123`);
    console.log('─'.repeat(10));
    console.log('');
}

main()
    .catch((error) => {
        console.error('\n Error en seed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
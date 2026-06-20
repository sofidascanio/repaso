import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ProjectModule } from './project/project.module';
import { CollectionModule } from './collection/collection.module';
import { FlashcardModule } from './flashcard/flashcard.module';
import { ReviewModule } from './review/review.module';
import { StatsModule } from './stats/stats.module';
import { validate } from './config/env.validation';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate,
		}),
		PrismaModule,
		AuthModule,
		WorkspaceModule,
		ProjectModule,
		CollectionModule,
		FlashcardModule,
		ReviewModule,
		StatsModule,
	],
})
export class AppModule {}
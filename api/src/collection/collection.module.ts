import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { ProjectModule } from '@/project/project.module';

@Module({
    imports: [ProjectModule],
    controllers: [CollectionController],
    providers: [CollectionService],
    exports: [CollectionService],
})
export class CollectionModule {}
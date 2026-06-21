import { Module } from '@nestjs/common';
import { ImportExportController } from './import-export.controller';
import { ImportExportService } from './import-export.service';
import { CollectionModule } from '@/collection/collection.module';

@Module({
    imports: [CollectionModule],
    controllers: [ImportExportController],
    providers: [ImportExportService],
})
export class ImportExportModule {}
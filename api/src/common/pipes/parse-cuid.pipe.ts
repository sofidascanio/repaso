import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';

// formato cuid: empieza con 'c' seguido de 25 caracteres alfanumericos
const CUID_REGEX = /^c[a-z0-9]{24,}$/i;

@Injectable()
export class ParseCuidPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string {
        if (!value || !CUID_REGEX.test(value)) {
            throw new BadRequestException(
                `El parámetro '${metadata.data}' no es un ID válido`,
            );
        }
        return value;
    }
}
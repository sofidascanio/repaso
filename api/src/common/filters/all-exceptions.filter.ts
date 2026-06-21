import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';

        // errores de prisma 
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
        switch (exception.code) {
            case 'P2002':
                status = HttpStatus.CONFLICT;
                message = 'Ya existe un registro con ese valor único';
                break;
            case 'P2025':
                status = HttpStatus.NOT_FOUND;
                message = 'Registro no encontrado';
                break;
            case 'P2003':
                status = HttpStatus.BAD_REQUEST;
                message = 'Restricción de clave foránea';
                break;
            default:
                status = HttpStatus.BAD_REQUEST;
                message = `Error de base de datos: ${exception.code}`;
        }
        } else if (exception instanceof Prisma.PrismaClientValidationError) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Datos inválidos para la operación';
        }

        this.logger.error(
            `${request.method} ${request.url} → ${status}`,
            exception instanceof Error ? exception.stack : String(exception),
        );

        response.status(status).json({
            statusCode: status,
            message,
            error: HttpStatus[status],
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}
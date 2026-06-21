import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
    statusCode: number;
    message: string | string[];
    error: string;
    path: string;
    timestamp: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message: string | string[];
        let error: string;

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
            error = exception.message;
        } else if (typeof exceptionResponse === 'object') {
            const res = exceptionResponse as Record<string, unknown>;
            message = (res.message as string | string[]) ?? exception.message;
            error = (res.error as string) ?? HttpStatus[status];
        } else {
            message = exception.message;
            error = HttpStatus[status];
        }

        const errorResponse: ErrorResponse = {
            statusCode: status,
            message,
            error,
            path: request.url,
            timestamp: new Date().toISOString(),
        };

        if (status >= 500) {
            this.logger.error(
                `${request.method} ${request.url} → ${status}`,
                exception.stack,
            );
        } else {
            this.logger.warn(
                `${request.method} ${request.url} → ${status}: ${JSON.stringify(message)}`,
            );
        }

        response.status(status).json(errorResponse);
    }
}
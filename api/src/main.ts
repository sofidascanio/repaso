import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
      	logger: ['error', 'warn', 'log', 'debug'],
    });

    app.use(cookieParser());

    // filtros de excepciones, el ordne importa: allexceptions primero, http despues
    app.useGlobalFilters(
		new AllExceptionsFilter(),
		new HttpExceptionFilter(),
    );

    // logging
    app.useGlobalInterceptors(new LoggingInterceptor());

    app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			exceptionFactory: (errors) => {
				const messages = errors.flatMap((e) =>
					Object.values(e.constraints ?? {}),
				);
				// importa HttpException para devolver el formato correcto
				const { UnprocessableEntityException } = require('@nestjs/common');
				return new UnprocessableEntityException(messages);
			},
		}),
    );

    app.setGlobalPrefix('api');

    app.enableCors({
		origin: process.env.FRONTEND_URL ?? 'http://localhost:3001',
		credentials: true,
    });

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    Logger.log(`API corriendo en: http://localhost:${port}/api`);
}

bootstrap();
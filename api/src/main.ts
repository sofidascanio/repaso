import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

	app.useGlobalFilters(
		new AllExceptionsFilter(),
		new HttpExceptionFilter(),
	);

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

	// swagger 
	const config = new DocumentBuilder()
		.setTitle('Repaso API')
		.setDescription('API de la plataforma de flashcards Repaso')
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				description: 'Ingresa el access token obtenido en /api/auth/login',
			},
			'access-token',
		)
		.addTag('Auth', 'Registro, login, refresh y logout')
		.addTag('Profile', 'Perfil y configuración de cuenta')
		.addTag('Workspaces', 'Gestión de workspaces')
		.addTag('Projects', 'Gestión de projects')
		.addTag('Collections', 'Gestión de collections')
		.addTag('Flashcards', 'Gestión de flashcards')
		.addTag('Reviews', 'Repasos y spaced repetition')
		.addTag('Stats', 'Estadísticas y progreso')
		.addTag('Search', 'Búsqueda global')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			tagsSorter: 'alpha',
			operationsSorter: 'alpha',
		},
	});

	const port = process.env.PORT ?? 3000;
	await app.listen(port);

	Logger.log(`Corriendo en: http://localhost:${port}/api`);
	Logger.log(`Swagger docs en: http://localhost:${port}/docs`);
}

bootstrap();
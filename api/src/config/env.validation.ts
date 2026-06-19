import { plainToInstance } from 'class-transformer';
import { IsString, IsNumber, IsOptional, validateSync } from 'class-validator';

class EnvironmentVariables {
    @IsString()
    DATABASE_URL!: string;

    @IsNumber()
    @IsOptional()
    PORT: number = 3000;

    @IsString()
    @IsOptional()
    NODE_ENV: string = 'development';

    @IsString()
    JWT_SECRET!: string;

    @IsString()
    @IsOptional()
    JWT_EXPIRES_IN: string = '15m';

    @IsString()
    JWT_REFRESH_SECRET!: string;

    @IsString()
    @IsOptional()
    JWT_REFRESH_EXPIRES_IN: string = '7d';
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    return validatedConfig;
}
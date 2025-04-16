// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('./secrets/private-key.pem'),
    cert: readFileSync('./secrets/certificate.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 443);
}
bootstrap();
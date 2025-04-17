// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('./secrets/key.pem'),
    cert: readFileSync('./secrets/cert.pem'),
    passphrase: process.env.PRIVATE_KEY_PASSPHRASE,
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 443);
}
bootstrap();
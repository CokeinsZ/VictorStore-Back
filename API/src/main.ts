// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('./secrets/key.pem'),
    cert: readFileSync('./secrets/cert.pem'),
    passphrase: process.env.PRIVATE_KEY_PASSPHRASE,
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  // Configuración básica de Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`],
          imgSrc: [`'self'`, 'data:' ],
          scriptSrc: [`'self'` ],
        },
      },
      hsts: { maxAge: 31536000 },
      frameguard: { action: 'deny' },
    })
  );

  // Configuración de CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 443);
}
bootstrap();
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './tools/guards/jwt-auth.guard';
import { AbilitiesModule } from './tools/abilities/abilities.module';
import { PoliciesGuard } from './tools/guards/policies.guard';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { RepositoriesModule } from './database/repositories/repositories.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
    UsersModule,
    AbilitiesModule,
    DatabaseModule,
    RepositoriesModule,
    CategoriesModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    DatabaseService,
  ],
})
export class AppModule {}

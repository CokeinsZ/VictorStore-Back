import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './users/guards/jwt-auth.guard';
import { AbilitiesModule } from './abilities/abilities.module';
import { PoliciesGuard } from './users/guards/policies.guard';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { RepositoriesModule } from './repositories/repositories.module';

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
    ProductsModule,
    AbilitiesModule,
    CategoriesModule,
    DatabaseModule,
    RepositoriesModule,
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

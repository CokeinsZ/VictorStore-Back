import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtStrategy } from '../tools/strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';
import { AbilitiesModule } from 'src/tools/abilities/abilities.module';
import { RepositoriesModule } from 'src/database/repositories/repositories.module';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EmailModule,
    AbilitiesModule,
    RepositoriesModule
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
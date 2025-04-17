import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { VerificatoinCodesRepository } from './verification-codes.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [UsersRepository, VerificatoinCodesRepository],
    exports: [UsersRepository, VerificatoinCodesRepository],
})
export class RepositoriesModule {}

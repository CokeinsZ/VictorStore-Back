import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class VerificatoinCodesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: number, code: string): Promise<void> {
    const query = `INSERT INTO Verification_Codes (user_id, code) VALUES (@UserId, @Code)`;
    await this.databaseService.executeQuery(query, { UserId: userId, Code: code });
  }

  async find(userId: number): Promise<{code: String, created_at: Date, expires_at: Date} | null> {
    const query = `SELECT * FROM Verification_Codes WHERE user_id = @UserId`;
    const result = await this.databaseService.executeQuery<{code: String, created_at: Date, expires_at: Date}>(query, { UserId: userId });
    return result[0] || null;
  }

  async erase(userId: number): Promise<void> {
    const query = `DELETE FROM Verification_Codes WHERE user_id = @UserId`;
    await this.databaseService.executeQuery(query, { UserId: userId });
  }

}
import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { User } from '../../users/interfaces/user.interface';

@Injectable()
export class UsersRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async findAll(): Promise<User[]> {
        const query = `SELECT * FROM Users`;
        return this.databaseService.executeQuery<User>(query);
    }

    async findByEmail(email: string): Promise<User | null> {
        const query = `SELECT * FROM Users WHERE email = @Email`;
        const result = await this.databaseService.executeQuery<User>(query, { Email: email });
        return result[0] || null;
    }

    async findByNickName(nick_name: string): Promise<User | null> {
        const query = `SELECT * FROM Users WHERE nick_name = @NickName`;
        const result = await this.databaseService.executeQuery<User>(query, { NickName: nick_name });
        return result[0] || null;
    }

    async findById(id: number): Promise<User | null> {
        const query = `SELECT * FROM Users WHERE id = @Id`;
        const result = await this.databaseService.executeQuery<User>(query, { Id: id });
        return result[0] || null;
    }

    async createUser(user: Partial<User>): Promise<User> {
        const query = `
      INSERT INTO Users (nick_name, first_name, middle_name, last_name, email, password)
      OUTPUT INSERTED.*
      VALUES (@NickName, @FirstName, @MiddleName, @LastName, @Email, @Password)
    `;
        const result = await this.databaseService.executeQuery<User>(query, {
            NickName: user.nick_name,
            FirstName: user.first_name,
            MiddleName: user.middle_name,
            LastName: user.last_name,
            Email: user.email,
            Password: user.password,
        });
        return result[0];
    }

    async updateUser(id: number, user: Partial<User>): Promise<User> {
        let params = ``
        let values = {}
        for (const key in user) {
            if (key === 'id') { continue }; // Skip id field in the update

            params += `${key} = @${key}, `
            values[key] = user[key]
        }
        values['Id'] = id // Add id to the values

        if (params.length === 0) {
            throw new BadRequestException('No fields to update. (You can\'t update the id)');
        }
        params = params.slice(0, -2); // Remove the last comma and space

        const query = `
            UPDATE Users
            SET ${params}
            OUTPUT INSERTED.*
            WHERE id = @Id
        `;
        const result = await this.databaseService.executeQuery<User>(query, values);
        return result[0];
    }

    async updateUserStatus(id: number, status: string): Promise<User> {
        const query = `
      UPDATE Users
      SET status = @Status
      OUTPUT INSERTED.*
      WHERE id = @Id
    `;
        const result = await this.databaseService.executeQuery<User>(query, {
            Id: id,
            Status: status,
        });
        return result[0];
    }

    async updateUserRole(id: number, role: string): Promise<User> {
        const query = `
      UPDATE Users
      SET role = @Role
      OUTPUT INSERTED.*
      WHERE id = @Id
    `;
        const result = await this.databaseService.executeQuery<User>(query, {
            Id: id,
            Role: role,
        });
        return result[0];
    }

    async updateUserPassword(id: number, password: string): Promise<User> {
        const query = `
      UPDATE Users
      SET password = @Password
      OUTPUT INSERTED.*
      WHERE id = @Id
    `;
        const result = await this.databaseService.executeQuery<User>(query, {
            Id: id,
            Password: password,
        });
        return result[0];
    }

    async updateFailedAttempts(id: number, attempts: number): Promise<User> {
        const query = `
            UPDATE Users
            SET failed_login_attempts = @Attempts
            OUTPUT INSERTED.*
            WHERE id = @Id
        `;

        const result = await this.databaseService.executeQuery<User>(query, {
            Id: id,
            Attempts: attempts,
        });
        return result[0];
    }

    async resetFailedAttempts(id: number): Promise<void> {
        const query = `
            UPDATE Users
            SET failed_login_attempts = 0
            OUTPUT INSERTED.*
            WHERE id = @Id
        `;

        await this.databaseService.executeQuery<User>(query, { Id: id });
    }

    async deleteUser(id: number): Promise<void> {
        const query = `DELETE FROM Users WHERE id = @Id`;
        await this.databaseService.executeQuery(query, { Id: id });
    }
}
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsOptional,
    IsEnum,
    MaxLength,
    IsNumber
  } from 'class-validator';
import { user_role, user_status } from '../interfaces/user.interface';

  export class CreateUserDto {
    @IsOptional()
    @IsEnum(user_role, { message: 'role must be one of the following: user, editor, admin' } )
    role?: user_role = user_role.USER;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    nick_name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    first_name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    middle_name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    last_name: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(user_status, { message: 'status must be one of the following: not_verified, active, inactive, banned' } )
    status?: user_status = user_status.NOT_VERIFIED;

  }
  
  export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MaxLength(20)
    nick_name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    first_name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    middle_name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    last_name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
  }

  export class UpdateUserStatusDto {
    @IsNotEmpty()
    @IsEnum(user_status, { message: 'status must be one of the following: not_verified, active, inactive, banned' } )
    status: user_status;
  }

  export class UpdateUserRoleDto {
    @IsNotEmpty()
    @IsEnum(user_role, { message: 'role must be one of the following: user, editor, admin' } )
    role: user_role;
  }
  
  export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  }
  
  export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    code: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword: string;
  }
  
  export class VerifyEmailDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
  
    @IsNotEmpty()
    @IsString()
    code: string;
  }
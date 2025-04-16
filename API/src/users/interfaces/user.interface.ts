import {
  ChangePasswordDto,
  CreateUserDto,
  LoginDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  VerifyEmailDto,
} from '../dto/user.dto';

export enum user_status {
  NOT_VERIFIED = 'not_verified',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export enum user_role {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export interface User {
  id: number;
  role: user_role;
  nick_name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  password: string;
  status: user_status;
}

export interface UserServiceInterface {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByNickName(nick_name: string): Promise<User>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
  remove(id: number): Promise<void>;
  verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }>;

  login(
    loginDto: LoginDto,
  ): Promise<{ message: string, userId: string }>;

  changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void>;

  updateStatus(
    id: number,
    status: UpdateUserStatusDto,
  ): Promise<User>;

  updateRole(
    id: number,
    role: UpdateUserRoleDto,
  ): Promise<User>;
}

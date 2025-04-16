import {
    ChangePasswordDto,
    CreateUserDto,
    LoginDto,
    UpdateUserDto,
    VerifyEmailDto,
    VerifyPhoneDto,
  } from '../dto/user.dto';
  
  export interface User {
    _id?: string;          // MongoDB 
    id?: string;           
    name: string;
    email: string;
    phone: string;
    isVerified: boolean;
    role: string;
    refreshToken?: string;
    verificationCode?: string;
    verificationCodeExpires?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface UserServiceInterface {
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }>;
    verifyPhone(verifyPhoneDto: VerifyPhoneDto): Promise<{ message: string }>;
    login(
      loginDto: LoginDto,
    ): Promise<{ message: string, userId: string }>;
    refreshToken(
      refreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string }>;
    changePassword(
      id: string,
      changePasswordDto: ChangePasswordDto,
    ): Promise<void>;
  }
  
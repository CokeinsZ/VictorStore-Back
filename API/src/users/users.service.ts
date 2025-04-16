import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto, CreateUserDto, LoginDto, UpdateUserDto, UpdateUserRoleDto, UpdateUserStatusDto, VerifyEmailDto } from './dto/user.dto';
import { EmailService } from '../email/email.service';
import { User, UserServiceInterface } from './interfaces/user.interface';
import { SmsService } from 'src/sms/sms.service';
import { UsersRepository } from '../repositories/users.repository';
import { VerificatoinCodesRepository } from 'src/repositories/verification-codes.repository';

@Injectable()
export class UsersService implements UserServiceInterface {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly verificationCodeRepository: VerificatoinCodesRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = {
      ...createUserDto,
      password: hashedPassword,
    };

    const savedUser = await this.userRepository.createUser(newUser);
    if (!savedUser) {
      throw new BadRequestException('User creation failed');
    }

    // Generate verification code and save it to the database
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await this.verificationCodeRepository.create(savedUser.id, verificationCode);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      savedUser.email,
      savedUser.nick_name,
      verificationCode,
    );

    return this.toUserInterface(savedUser);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();

    return users.map(user => this.toUserInterface(user));
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserInterface(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserInterface(user);
  }

  async findByNickName(nick_name: string): Promise<User> {
    const user = await this.userRepository.findByNickName(nick_name);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserInterface(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userRepository.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return this.toUserInterface(updatedUser);
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const dbCode = await this.verificationCodeRepository.find(id);
    if (!dbCode) {
      throw new NotFoundException('Verification code not found, please request a new one');
    }

    if (dbCode.code !== changePasswordDto.code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    if (new Date() > dbCode.expires_at) {
      throw new UnauthorizedException('Verification code expired, please request a new one');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepository.updateUserPassword(id, hashedPassword);
  }

  async updateStatus(id: number, status: UpdateUserStatusDto): Promise<User> {
    const user = await this.userRepository.updateUserStatus(id, status.status);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserInterface(user);
  }

  async updateRole(id: number, role: UpdateUserRoleDto): Promise<User> {
    const user = await this.userRepository.updateUserRole(id, role.role);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserInterface(user);
  }

  async remove(id: number): Promise<void> {
    return await this.userRepository.deleteUser(id);
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string; }> {
    const dbCode = await this.verificationCodeRepository.find(verifyEmailDto.id);
    if (!dbCode) {
      throw new NotFoundException('Verification code not found, please request a new one');
    }
    if (dbCode.code !== verifyEmailDto.code) {
      throw new UnauthorizedException('Invalid verification code');
    }
    if (new Date() > dbCode.expires_at) {
      throw new UnauthorizedException('Verification code expired, please request a new one');
    }
    const user = await this.userRepository.updateUserStatus(verifyEmailDto.id, 'active');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.verificationCodeRepository.erase(verifyEmailDto.id);
    return { message: 'Email verified successfully' };
  }

  async login(loginDto: LoginDto): Promise<{ message: string; userId: string; token: string; }> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    });
    return {
      message: 'Login successful',
      userId: user.id.toString(),
      token,
    };
  }

  private toUserInterface(userDoc: any): User {
    const userObj = userDoc.toObject();
    delete userObj.password;
    return userObj as User;
  }
  
}
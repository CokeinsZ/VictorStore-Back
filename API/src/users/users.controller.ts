import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
  ChangePasswordDto,
  VerifyEmailDto,
  UpdateUserStatusDto,
  UpdateUserRoleDto,
} from './dto/user.dto';
import { Public } from '../decorators/public.decorator';
import { CheckPolicies } from '../decorators/check-policies.decorator';
import { Action } from '../abilities/ability.factory';

@Controller('vs/api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
    return { message: 'User registered successfully. Please check your email for verification code.' };
  }

  @Public()
  @Post('verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.usersService.verifyEmail(verifyEmailDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Get()
  @CheckPolicies({ action: Action.Read, subject: 'User' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @CheckPolicies({ action: Action.Read, subject: 'User', checkData: true })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  @CheckPolicies({ action: Action.Read, subject: 'User' })
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get('nick_name/:nick_name')
  @CheckPolicies({ action: Action.Read, subject: 'User' })
  findByNickName(@Param('nick_name') nick_name: string) {
    return this.usersService.findByNickName(nick_name);
  }

  @Patch(':id')
  @CheckPolicies({ action: Action.Update, subject: 'User', checkData: true })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/status')
  @CheckPolicies({ action: Action.Update, subject: 'User.status' })
  updateStatus(
    @Param('id') id: number,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(id, updateUserStatusDto);
  }

  @Patch(':id/role')
  @CheckPolicies({ action: Action.Update, subject: 'User.role' })
  updateRole(
    @Param('id') id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(id, updateUserRoleDto);
  }

  @Delete(':id')
  @CheckPolicies({ action: Action.Delete, subject: 'User' })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Public()
  @Post(':id/change-password')
  changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }
}

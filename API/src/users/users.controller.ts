import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards, 
    HttpCode, 
    HttpStatus 
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { 
    CreateUserDto, 
    UpdateUserDto, 
    LoginDto, 
    RefreshTokenDto, 
    ChangePasswordDto, 
    VerifyEmailDto, 
    VerifyPhoneDto
  } from './dto/user.dto';
  import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CheckPolicies } from './decorators/check-policies.decorator';
import { Action } from 'src/abilities/ability.factory';
import { Check } from 'typeorm';
  
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
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
    @Post('verify-phone')
    verifyPhone(@Body() verifyPhoneDto: VerifyPhoneDto) {
      return this.usersService.verifyPhone(verifyPhoneDto);
    }
  
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDto: LoginDto) {
      return this.usersService.login(loginDto);
    }
  
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
      return this.usersService.refreshToken(refreshTokenDto.refreshToken);
    }
  
    @Get()
    @CheckPolicies({ action: Action.Read, subject: 'User' })
    findAll() {
      return this.usersService.findAll();
    }
  
    @Get(':id')
    @CheckPolicies({ action: Action.Read, subject: 'User' })
    findOne(@Param('id') id: string) {
      return this.usersService.findOne(id);
    }
  
    @Patch(':id')
    @CheckPolicies({ action: Action.Update, subject: 'User' })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(id, updateUserDto);
    }
  
    @Delete(':id')
    @CheckPolicies({ action: Action.Delete, subject: 'User' })
    remove(@Param('id') id: string) {
      return this.usersService.remove(id);
    }
  
    @Post(':id/change-password')
    changePassword(
      @Param('id') id: string,
      @Body() changePasswordDto: ChangePasswordDto,
    ) {
      return this.usersService.changePassword(id, changePasswordDto);
    }
  }
  
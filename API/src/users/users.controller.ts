import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    Request,
    ForbiddenException,
    UseGuards
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
import { Public } from '../tools/decorators/public.decorator';
import { CheckPolicies } from '../tools/decorators/check-policies.decorator';
import { Action } from '../tools/abilities/ability.factory';
import { RolesGuard } from 'src/tools/guards/roles.guard';
import { Roles } from 'src/tools/decorators/roles.decorator';
import { user_role, user_status } from './interfaces/user.interface';

@Controller('vs/api/v1/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Public()
    @Post('signup')
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        return { message: 'User registered successfully. Please check your email for verification code.', user };
    }

    @Public()
    @Post('verify-email')
    verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.usersService.verifyEmail(verifyEmailDto);
    }

    @Public()
    @Post('resend-verification-code')
    resendVerificationCode(@Body() body: {email: string}) {
        // 1) Quitamos comillas simples o dobles al inicio/final
        // 2) Luego lowercase, espacio y trim
        const normaliced_email = body.email
            .replace(/^['"]+|['"]+$/g, '')
            .toLowerCase()
            .replace(/\s+/g, '')
            .trim();

        return this.usersService.resendVerificationCode(normaliced_email);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.usersService.login(loginDto);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles('admin', 'editor')
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @CheckPolicies({ action: Action.Read, subject: 'User' })
    findOne(@Param('id') id: number, @Request() req) {

        //Check user specific permission condition
        if (req.user.role === 'user' && req.user.id != id) {
            // If the user is not an admin and is trying to access another user's account
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return this.usersService.findOne(id);
    }

    @Get('email/:email')
    @Public()
    findByEmail(@Param('email') email: string) {

        // 1) Quitamos comillas simples o dobles al inicio/final
        // 2) Luego lowercase, espacio y trim
        const normaliced_email = email
            .replace(/^['"]+|['"]+$/g, '')
            .toLowerCase()
            .replace(/\s+/g, '')
            .trim();

        return this.usersService.findByEmail(normaliced_email);
    }

    @Get('nick_name/:nick_name')
    @Public()
    findByNickName(@Param('nick_name') nick_name: string) {

        const normaliced_nick_name = nick_name
            .replace(/^['"]+|['"]+$/g, '')
            .replace(/\s+/g, '')
            .trim();

        return this.usersService.findByNickName(normaliced_nick_name);
    }

    @Patch(':id')
    @CheckPolicies({ action: Action.Update, subject: 'User' })
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req) {

        //Check user specific permission condition
        if (req.user.role === 'user' && req.user.id != id) {
            console.log('User ID:', req.user.id);
            console.log('Requested ID:', id);
            // If the user is not an admin and is trying to access another user's account
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return this.usersService.update(id, updateUserDto);
    }

    @Patch(':id/status')
    @CheckPolicies({ action: Action.Update, subject: 'User.status' })
    updateStatus(
        @Param('id') id: number,
        @Body() updateUserStatusDto: UpdateUserStatusDto,
    ) {
        if (!Object.values(user_status).includes(updateUserStatusDto.status)) {
            throw new ForbiddenException('Invalid status provided');
        }

        return this.usersService.updateStatus(id, updateUserStatusDto);
    }

    @Patch(':id/role')
    @CheckPolicies({ action: Action.Update, subject: 'User.role' })
    updateRole(
        @Param('id') id: number,
        @Body() updateUserRoleDto: UpdateUserRoleDto,
    ) {

        if (!Object.values(user_role).includes(updateUserRoleDto.role)) {
            throw new ForbiddenException('Invalid role provided');
        }
            
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

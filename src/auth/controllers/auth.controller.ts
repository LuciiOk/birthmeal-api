import {
  Body,
  Controller,
  Post,
  Req,
  UseInterceptors,
  UseGuards,
  Headers,
  Get,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
import { CreateAdminDTO } from '../dtos/CreateAdminDto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyDto,
} from '../dtos/forgotPassword.dto';

import { CreateUserDTO } from '../dtos/user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Auth } from '../schemas/auth.schema';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@UseInterceptors(
  new SanitizeMongooseModelInterceptor({
    excludeMongooseId: false,
    excludeMongooseV: true,
  }),
)
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('LOCAL'))
  @Post('login')
  public async login(@Req() req: Request) {
    const user = req.user as Auth;
    return this.authService.generateJWT(user);
  }

  // admin login
  @UseGuards(AuthGuard('ADMIN'))
  @Post('admin/login')
  public async adminLogin(@Req() req: Request) {
    const user = req.user as Auth;
    return this.authService.generateJWT(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/register')
  public async adminRegister(@Body() createUser: CreateAdminDTO) {
    return this.authService.createAdmin(createUser);
  }

  @Post('register')
  public async register(@Body() createUser: CreateUserDTO) {
    return this.userService.create(createUser);
  }

  @Post('logout')
  public async logout(@Req() req: Request) {}

  @Post('forgot-password')
  public async forgotPassword(@Body() email: ForgotPasswordDto) {
    return this.authService.forgotPassword(email.email);
  }

  @Post('verify')
  public async verify(@Body() verifyToken: VerifyDto) {
    try {
      return this.authService.verifyCode(verifyToken);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('reset-password')
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      return this.authService.resetPassword(resetPasswordDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('verify-token')
  public async verifyToken(@Headers('authorization') token: string) {
    try {
      return this.authService.verifyToken(token);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

import {
  Body,
  Controller,
  Post,
  Req,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
import { Public } from '../decorators/public.decorator';
import { ForgotPasswordDto } from '../dtos/forgotPassword.dto';

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
  @Public()
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

  @Public()
  @Post('register')
  public async register(@Body() createUser: CreateUserDTO) {
    return this.userService.create(createUser);
  }

  @Post('logout')
  public async logout(@Req() req: Request) {}

  @Post('forgot-password')
  public async forgotPassword(@Body() email: ForgotPasswordDto) {
    // return this.authService.forgotPassword(email);
  }
}

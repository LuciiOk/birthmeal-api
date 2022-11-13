import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthService } from '../services/google-auth.service';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @UseGuards(AuthGuard('google'))
  @Get()
  async googleAuth(@Req() req) {}

  @UseGuards(AuthGuard('google'))
  @Get('redirect')
  googleAuthRedirect(@Req() req: any) {
    // handles the Google OAuth2 callback
    return this.googleAuthService.googleLogin(req);
  }
}

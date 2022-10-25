import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PayloadToken } from '../models/Payload.model';
import { UserService } from '../services/user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('favorite')
  addCompanyToFavorites(
    @Req() req: Request,
    @Body('company') companyID: string,
  ) {
    const { userID } = req.user as PayloadToken;
    const userIDString = userID.toString();
    return this.userService.addCompanyToFavorites(userIDString, companyID);
  }
}

import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../decorators/public.decorator';
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

  @Get('favorite')
  getFavoriteCompanies(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const { userID } = req.user as PayloadToken;
    const userIDString = userID.toString();
    return this.userService.getFavoriteCompanies(userIDString, page, limit);
  }

  @Get('favorite/:companyId')
  getFavoriteCompany(
    @Req() req: Request,
    @Param('companyId') companyId: string,
  ) {
    const user = req.user as PayloadToken;
    if (!user) return false;
    const { userID } = req.user as PayloadToken;
    const userIDString = userID.toString();
    return this.userService.getFavoriteCompany(userIDString, companyId);
  }
}

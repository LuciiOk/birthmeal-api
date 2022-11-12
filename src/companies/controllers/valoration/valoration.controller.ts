import {
  Controller,
  Post,
  Get,
  Put,
  Req,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { PayloadToken } from 'src/auth/models/Payload.model';
import { Role } from 'src/auth/schemas/auth.schema';
import { ValorationService } from 'src/companies/services/valoration/valoration.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('valoration')
export class ValorationController {
  constructor(private readonly valorationService: ValorationService) {}

  @Roles(Role.USER)
  @Post(':companyID')
  @ApiTags('Realizar una calificación a una empresa; 1 a 5')
  create(
    @Req() req: Request,
    @Body('valoration') valoration: number,
    @Param('companyID') companyID: string,
  ) {
    const { userID } = req.user as PayloadToken;

    return this.valorationService.create(
      valoration,
      userID.toString(),
      companyID,
    );
  }

  @Public()
  @Get(':companyID')
  @ApiTags('Valoraciones')
  findByCompany(@Param('companyID') companyID: string) {
    return this.valorationService.getValorationByCompany(companyID);
  }
}

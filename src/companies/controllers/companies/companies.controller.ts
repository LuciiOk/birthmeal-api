import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CompanyDto, UpdateCompanyDto } from 'src/companies/dtos/companies.dto';
import { CompaniesService } from 'src/companies/services/companies/companies.service';

import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/schemas/auth.schema';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private companyService: CompaniesService) {}

  @Post()
  @Public()
  @Roles(Role.ADMIN)
  create(@Body() user: CompanyDto) {
    return this.companyService.create(user);
  }

  @Post('rating/:id')
  @Public()
  addValoration(
    @Param('id') id: string,
    @Body('valoration') valoration: number,
  ) {
    return this.companyService.addValoration(id, valoration);
  }

  @Get('category/:id')
  @Roles(Role.ADMIN)
  findByCategory(@Param('id') id: string) {
    return this.companyService.findByCategory(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: UpdateCompanyDto) {
    return this.companyService.update(id, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  @Get()
  @Public()
  findAll(@Query('categories') categories: string[]) {
    return this.companyService.findAll(categories);
  }

  @Get(':id')
  @Roles(Role.USER)
  findOne(@Param('id') id: string) {
    return this.companyService.findOne2(id);
  }
}

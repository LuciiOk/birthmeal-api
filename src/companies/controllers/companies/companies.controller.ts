import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompanyDto, UpdateCompanyDto } from 'src/companies/dtos/companies.dto';
import { CompaniesService } from 'src/companies/services/companies/companies.service';

import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('companies')
export class CompaniesController {
  constructor(private companyService: CompaniesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() user: CompanyDto) {
    return this.companyService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: UpdateCompanyDto) {
    return this.companyService.update(id, user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  @Get('')
  findAll() {
    return this.companyService.findAll();
  }
}

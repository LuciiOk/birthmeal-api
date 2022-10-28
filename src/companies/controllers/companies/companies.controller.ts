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

import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private companyService: CompaniesService) {}

  @Public()
  @Post()
  create(@Body() user: CompanyDto) {
    return this.companyService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: UpdateCompanyDto) {
    return this.companyService.update(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  @Public()
  @Get('')
  findAll() {
    return this.companyService.findAll();
  }

  @Public()
  @Get('category/:id')
  findByCategory(@Param('id') id: string) {
    return this.companyService.findByCategory(id);
  }
}

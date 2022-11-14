import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/schemas/auth.schema';
import {
  CategoryDto,
  UpdateCategoryDto,
} from 'src/companies/dtos/categories.dto';
import { CategoriesService } from 'src/companies/services/categories/categories.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() user: CategoryDto) {
    return this.categoryService.create(user);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() user: UpdateCategoryDto) {
    return this.categoryService.update(id, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Public()
  @Get('companies')
  @HttpCode(HttpStatus.ACCEPTED)
  getCategoriesWithCompanies() {
    return this.categoryService.getCategoriesWithCompanies();
  }

  @Roles(Role.ADMIN)
  @Get('paginate')
  paginate(@Query('page') page: number = 1, @Query('limit') limit: number = 9) {
    console.log(page, limit);
    return this.categoryService.paginate(page, limit);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.ACCEPTED)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}

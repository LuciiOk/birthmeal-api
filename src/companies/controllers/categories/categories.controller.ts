import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/role.guard';
import {
  CategoryDto,
  UpdateCategoryDto,
} from 'src/companies/dtos/categories.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CategoriesService } from 'src/companies/services/categories/categories.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/schemas/auth.schema';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() user: CategoryDto) {
    return this.categoryService.create(user);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() user: UpdateCategoryDto) {
    return this.categoryService.update(id, user);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Get('/categories')
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}

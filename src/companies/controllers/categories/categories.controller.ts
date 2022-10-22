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
} from '@nestjs/common';
import {
  CategoryDto,
  UpdateCategoryDto,
} from 'src/companies/dtos/categories.dto';
import { CategoriesService } from 'src/companies/services/categories/categories.service';
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}
  @Post()
  create(@Body() user: CategoryDto) {
    return this.categoryService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: UpdateCategoryDto) {
    return this.categoryService.update(id, user);
  }

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

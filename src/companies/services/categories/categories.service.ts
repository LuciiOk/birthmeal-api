import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CategoryDto,
  UpdateCategoryDto,
} from 'src/companies/dtos/categories.dto';
import { Category } from 'src/companies/schemas/categories.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  findAll() {
    try {
      return this.categoryModel.find();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: string) {
    try {
      const Category = await this.categoryModel.findById(id).exec();
      if (!Category) {
        throw new NotFoundException(`Category #${id} not found`);
      }
      return Category;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  create(data: CategoryDto) {
    try {
      const newCategory = new this.categoryModel(data);
      return newCategory.save();
    } catch (error) {
      throw new HttpException("Can't create category", 500);
    }
  }

  update(id: string, changes: UpdateCategoryDto) {
    try {
      return this.categoryModel.findByIdAndUpdate(
        id,
        { $set: changes },
        { new: true },
      );
    } catch (error) {
      throw new HttpException("Can't update category", 500);
    }
  }

  remove(id: string) {
    try {
      return this.categoryModel.findByIdAndRemove(id);
    } catch (error) {
      throw new NotFoundException(`Category #${id} not found`);
    }
  }
}

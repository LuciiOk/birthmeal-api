import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.categoryModel.find().exec();
  }

  async findOne(id: string) {
    const Category = await this.categoryModel.findById(id).exec();
    if (!Category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return Category;
  }

  create(data: CategoryDto) {
    const newCategory = new this.categoryModel(data);
    return newCategory.save();
  }

  update(id: string, changes: UpdateCategoryDto) {
    const category = this.categoryModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  remove(id: string) {
    return this.categoryModel.findByIdAndDelete(id);
  }
}

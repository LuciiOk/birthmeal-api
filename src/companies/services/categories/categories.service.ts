import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Db } from 'mongodb';
import { Model } from 'mongoose';
import {
  CategoryDto,
  UpdateCategoryDto,
} from 'src/companies/dtos/categories.dto';
import { Category } from 'src/companies/schemas/categories.schema';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @Inject('MONGO') private readonly mongo: Db,
    @Inject(forwardRef(() => CompaniesService))
    private readonly companiesService: CompaniesService,
  ) {}

  findAll() {
    try {
      return this.categoryModel.find();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  public async paginate(page: number, limit: number) {
    try {
      const result = await this.categoryModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit);
      const total = await this.categoryModel.countDocuments();
      const totalPages = Math.ceil(total / limit) || 1;
      const totalPerPage = result.length;

      return {
        data: result,
        total,
        totalPages,
        totalPerPage,
        page: Number(page),
        limit: Number(limit),
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
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

  async remove(id: string) {
    const companies = await this.companiesService.findByCategory(id);
    if (companies.length > 0) {
      throw new HttpException(
        'No se puede eliminar la categoria porque hay establecimientos asociados',
        400,
      );
    }
    try {
      return this.categoryModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException("Can't delete category", 500);
    }
  }

  public async getCategoriesWithCompanies() {
    try {
      const categories = await this.categoryModel
        .aggregate([
          {
            $lookup: {
              from: 'companies',
              localField: '_id',
              foreignField: 'category',
              as: 'c',
            },
          },
          { $match: { c: { $ne: [] } } },
        ])
        .exec();
      return categories;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/companies/schemas/companies.schema';
import { CompanyDto, UpdateCompanyDto } from 'src/companies/dtos/companies.dto';
import { CategoriesService } from '../categories/categories.service';
import { LocationsService } from 'src/locations/services/locations.service';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => LocationsService))
    private readonly locationService: LocationsService,
  ) {}

  findAll(categoriesName?: string[]) {
    try {
      if (categoriesName) {
        const $in = Array.isArray(categoriesName)
          ? categoriesName
          : [categoriesName];
        console.log($in);
        return this.companyModel.aggregate([
          {
            $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'categories',
            },
          },
          {
            $unwind: '$categories',
          },
          {
            $match: {
              'categories.name': { $in },
            },
          },
        ]);
      }
      return this.companyModel.find();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async create(data: CompanyDto) {
    try {
      const newCompany = new this.companyModel(data);
      const category = await this.categoryService.findOne(data.category);
      if (!category) {
        throw new NotFoundException(`Category #${data.category} not found`);
      }
      newCompany.category = category;

      const locations = await this.locationService.createMany(
        data.locations,
        newCompany,
      );

      const company = await newCompany.save();
      return {
        ...company.toObject(),
        locations,
      };
    } catch (error) {
      throw new HttpException("Can't create company", 500);
    }
  }

  update(id: string, changes: UpdateCompanyDto) {
    try {
      const result = this.companyModel
        .findByIdAndUpdate(
          id,
          {
            $set: changes,
          },
          { new: true },
        )
        .populate('category');
      return result;
    } catch (error) {
      throw new HttpException("Can't update company", 500);
    }
  }

  remove(id: string) {
    try {
      return this.companyModel.findByIdAndRemove(id);
    } catch (error) {
      throw new NotFoundException(`Company #${id} not found`);
    }
  }

  async findOne(id: string): Promise<Company> {
    try {
      return await this.companyModel.findById(id);
    } catch (error) {
      throw new NotFoundException(`Company #${id} not found`);
    }
  }

  async findByCategory(id: string): Promise<Company[]> {
    try {
      return await this.companyModel.find({ category: id });
    } catch (error) {
      throw new NotFoundException(`Company #${id} not found`);
    }
  }
}

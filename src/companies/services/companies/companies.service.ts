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

  async findAll(categoriesName?: string[]) {
    try {
      if (categoriesName) {
        const $in = Array.isArray(categoriesName)
          ? categoriesName
          : [categoriesName];
        const result = await this.companyModel.aggregate([
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
        return result.map((item) => ({
          ...item,
          rating: this.calculateRating(item.rating),
        }));
      }
      const result = await this.companyModel.find().populate('category');
      return result.map((item) => ({
        ...item.toObject(),
        rating: this.calculateRating(item.rating) || 0,
      }));
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

  async findOne(id: string) {
    try {
      return await this.companyModel.findById(id);
    } catch (error) {
      throw new NotFoundException(`Company #${id} not found`);
    }
  }

  async findOne2(id: string) {
    try {
      const result = await this.companyModel.findById(id).populate('category');
      return {
        ...result.toObject(),
        rating: this.calculateRating(result.rating) || 0,
      };
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

  async addValoration(id: string, indexValoration: number) {
    try {
      if (
        indexValoration < 0 ||
        indexValoration > 4 ||
        !Number.isInteger(indexValoration)
      ) {
        throw new HttpException('Index valoration is not valid', 400);
      }
      const company = await this.findOne(id);
      if (!company) {
        throw new NotFoundException(`Company #${id} not found`);
      }

      const rating = company.rating;
      rating[indexValoration] = rating[indexValoration] + 1;
      const result = await this.companyModel.findByIdAndUpdate(
        id,
        {
          $set: { rating },
        },
        { new: true },
      );
      return this.calculateRating(result.rating);
    } catch (error) {
      throw new NotFoundException(`Company #${id} not found`);
    }
  }

  // [5, 0, 3, 0, 0] = 5 * 5 + 0 * 4 + 3 * 3 + 0 * 2 + 0 * 1 = 20 / 8 = 2.5
  // puntaje total / cantidad de votos
  private calculateRating(rating: number[]) {
    try {
      if (!rating) {
        return 0;
      }
      let totalScore = 0;
      for (let i = 0; i < rating.length; i++) {
        totalScore += rating[i] * (i + 1);
      }

      const totalVotes = rating.reduce((a, b) => a + b, 0);

      return totalScore / totalVotes;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

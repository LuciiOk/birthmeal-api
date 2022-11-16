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
import { ValorationService } from '../valoration/valoration.service';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => LocationsService))
    private readonly locationService: LocationsService,
    @Inject(forwardRef(() => ValorationService))
    private readonly valorationService: ValorationService,
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
        const companies = result.map(async (item) => ({
          ...item,
          rating: await this.valorationService.getValorationByCompany(item._id),
        }));
        return Promise.all(companies);
      }
      const result = await this.companyModel.find().populate('category');
      const companies = result.map(async (item) => ({
        ...item.toObject(),
        rating: await this.valorationService.getValorationByCompany(item._id),
      }));
      return Promise.all(companies);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async paginate(page: number, limit: number) {
    try {
      // return companies paginated
      let companies = await this.companyModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('category');

      const total = await this.companyModel.countDocuments();
      const totalPages = Math.ceil(total / limit) || 1;
      const totalPerPage = companies.length;

      const result = companies.map(async (item) => ({
        ...item.toObject(),
        rating: await this.valorationService.getValorationByCompany(item._id),
      }));

      console.log(page, limit, total, totalPages, totalPerPage);

      return {
        data: await Promise.all(result),
        total,
        totalPerPage,
        totalPages,
        page: Number(page),
        limit: Number(limit),
      };
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

  async update(id: string, changes: UpdateCompanyDto) {
    try {
      if (changes.locations) {
        const locationsCompany =
          await this.locationService.getLocationsByCompany(id);
        // eliminar las localizaciones que no esten en el array
        const locationsToDelete = locationsCompany.filter(
          (location) => !changes.locations.includes(location._id),
        );

        if (locationsToDelete.length > 0) {
          await this.locationService.removeMany(locationsToDelete);
        }

        // actualizar las localizaciones que esten en el array
        const locationsToUpdate = locationsCompany.filter((location) =>
          changes.locations.includes(location._id),
        );

        if (locationsToUpdate.length > 0) {
        }

        // crear las localizaciones que no esten en el array
        const locationsToCreate = changes.locations.filter(
          (location) => !locationsCompany.includes(location as any),
        );

        if (locationsToCreate.length > 0) {
          const company = await this.findOne(id);

          await this.locationService.createMany(locationsToCreate, company);
        }
      }
      const result = this.companyModel
        .findByIdAndUpdate(
          id,
          {
            $set: changes,
          },
          { new: true },
        )
        .populate('category');
      return {
        ...(await result).toObject(),
        rating: await this.valorationService.getValorationByCompany(id),
      };
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
        rating: await this.valorationService.getValorationByCompany(result._id),
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
}

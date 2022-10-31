import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Company } from 'src/companies/schemas/companies.schema';
import { CompanyDto, UpdateCompanyDto } from 'src/companies/dtos/companies.dto';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  findAll() {
    try {
      return this.companyModel.find();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  create(data: CompanyDto) {
    try {
      const newCompany = new this.companyModel(data);
      return newCompany.save();
    } catch (error) {
      throw new HttpException("Can't create company", 500);
    }
  }

  update(id: string, changes: UpdateCompanyDto) {
    try {
      return this.companyModel.findByIdAndUpdate(
        id,
        { $set: changes },
        { new: true },
      );
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

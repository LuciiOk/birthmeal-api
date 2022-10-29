import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompaniesService } from 'src/companies/services/companies/companies.service';
import { CreateUserDTO } from '../dtos/user.dto';
import { User } from '../schemas/user.schema';

import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
    private CompanyService: CompaniesService,
  ) {}

  async create(user: CreateUserDTO) {
    const newUser = await this.userModel.create(user);
    const userExists = await this.authService.findOneByEmail(
      user.userAuth.email,
    );
    if (userExists)
      throw new BadRequestException('Already exists an user with this email');
    const auth = await this.authService.create({
      email: user.userAuth.email,
      password: user.userAuth.password,
      confirmPassword: user.userAuth.confirmPassword,
      user: newUser._id,
    });
    const token = await this.authService.generateJWT(auth);
    return token;
  }

  async findOne(_id: string): Promise<User> {
    const user = await this.userModel.findById(_id).exec();
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async update(_id: string, user: User): Promise<User> {
    return this.userModel.findByIdAndUpdate(_id, user, { new: true }).exec();
  }

  async addCompanyToFavorites(_id: string, company: string): Promise<User> {
    const user = await this.userModel.findById(_id).exec();
    if (!user) throw new BadRequestException('User not found');
    const companyExists = await this.CompanyService.findOne(company);
    if (!companyExists)
      throw new BadRequestException('Company not found, try again');
    const index = user.favorites.indexOf(companyExists._id);
    if (index === -1) {
      user.favorites.push(companyExists);
      return this.userModel.findByIdAndUpdate(_id, user, { new: true }).exec();
    }
    user.favorites.splice(index, 1);
    return this.userModel.findByIdAndUpdate(_id, user, { new: true }).exec();
  }

  async getFavoriteCompanies(_id: string, page, limit): Promise<any> {
    const user = await this.userModel
      .findById(_id)
      .populate('favorites')
      .exec();
    if (!user) throw new BadRequestException('User not found');
    const favorites = user.favorites;
    const total = favorites.length;
    const totalPages = Math.ceil(total / limit);
    const offset = limit * (page - 1);
    const paginatedFavorites = favorites.slice(offset).slice(0, limit);
    return { total, totalPages, page, limit, data: paginatedFavorites };
  }

  async getFavoriteCompany(_id: string, company: string): Promise<boolean> {
    const user = await this.userModel
      .findById(_id)
      .exec();
    if (!user) throw new BadRequestException('User not found');
    const favorites = user.favorites;
    return favorites.some((favorite) => favorite._id == company);
  }
}

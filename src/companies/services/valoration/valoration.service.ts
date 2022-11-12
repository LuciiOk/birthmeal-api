import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompaniesService } from '../companies/companies.service';
import { Valoration } from './../../schemas/valoration.schema';

@Injectable()
export class ValorationService {
  constructor(
    @InjectModel(Valoration.name) private valorationModel: Model<Valoration>,
    private readonly companyService: CompaniesService,
  ) {}

  async create(valoration: Valoration, userId: string) {
    try {
      const newValoration = new this.valorationModel(valoration);
      newValoration.user = userId;
      // verificar si el usuario ya ha votado
      const valorationDB = await this.valorationModel.findOne({
        company: valoration.company,
        user: userId,
      });
      if (valorationDB) {
        this.update(valorationDB._id, valoration.stars, userId);
      }
      await newValoration.save();
      return newValoration;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async update(id: string, stars: number, userId: string) {
    try {
      const valorationDB = await this.valorationModel.findById(id);
      if (!valorationDB) {
        throw new HttpException('Not found', 404);
      }
      if (valorationDB.user.toString() !== userId) {
        throw new HttpException('Unauthorized', 401);
      }
      valorationDB.stars = stars;

      await valorationDB.save();

      return this.getValorationByCompany(valorationDB.company.toString());
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async getValorationByCompany(companyId: string) {
    try {
      const valorations = await this.valorationModel
        .find({ company: companyId })
        .populate('user');
      // separar los votos por la cantidad de estrellas
      const rating = [0, 0, 0, 0, 0];
      for (let i = 0; i < valorations.length; i++) {
        rating[valorations[i].stars - 1]++;
      }
      const ratingCalculated = this.calculateRating(rating);
      return ratingCalculated;
    } catch (error) {
      throw new HttpException(error, 500);
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

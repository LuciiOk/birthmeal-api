import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompaniesService } from '../companies/companies.service';
import { Valoration } from './../../schemas/valoration.schema';

@Injectable()
export class ValorationService {
  constructor(
    @InjectModel(Valoration.name) private valorationModel: Model<Valoration>,
    @Inject(forwardRef(() => CompaniesService))
    private readonly companyService: CompaniesService,
  ) {}

  async create(valoration: number, userId: string, companyId: string) {
    try {
      const companyDB = await this.companyService.findOne(companyId);
      if (!companyDB) {
        throw new HttpException('Company not found', 404);
      }

      const valorationDB = await this.valorationModel.findOne({
        company: companyId,
        user: userId,
      });

      if (valorationDB) {
        // update
        return this.update(valorationDB._id, valoration, userId);
      }

      const valorationCreated = new this.valorationModel({
        stars: valoration,
        company: companyId,
        user: userId,
      });

      await valorationCreated.save();
      return this.getValorationByCompany(companyId);
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

      if (valorationDB.stars === stars) {
        throw new HttpException('Ya calificaste con esta puntuación', 400);
      }
      valorationDB.stars = stars;

      await valorationDB.save();

      return this.getValorationByCompany(valorationDB.company.toString());
    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }
      throw new HttpException(error, 500);
    }
  }

  async getValorationByCompany(companyId: string) {
    try {
      const valorations = await this.valorationModel
        .find({ company: companyId })

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
      if (totalVotes === 0 || totalScore === 0) {
        return 0;
      }
      const result:number = totalScore / totalVotes;

      return Number(result.toFixed(2));
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}

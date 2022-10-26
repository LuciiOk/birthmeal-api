import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Region } from '../schemas/region.schema';

import * as regions from '../data/regions.json';
import { Commune } from '../schemas/region.schema';

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(Region.name) private readonly regionModel: Model<Region>,
  ) {}

  async findAll(): Promise<Region[]> {
    return await this.regionModel.find().exec();
  }

  async createAll() {
    const regionsC = [];
    regions.regions.forEach(async (region) => {
      const newRegion = new this.regionModel(region);
      newRegion.communes = region.communes.map((commune) => {
        return {
          id: commune.id,
          name: commune.name,
        } as Commune;
      });
      regionsC.push(newRegion);
      await newRegion.save();
    });
    return regionsC;
  }
}

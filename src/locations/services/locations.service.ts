import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Db } from 'mongodb';
import { Model } from 'mongoose';
import { GoogleMapsService } from 'src/google-maps/google-maps.service';
import { GeoLocation, Location } from '../schemas/locations.schema';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
    @InjectModel(GeoLocation.name) private geoLocationModel: Model<GeoLocation>,
    @Inject('MONGO') private database: Db,
    private readonly googleMapsService: GoogleMapsService,
  ) {}

  async createLocation(location: Location): Promise<Location> {
    const createdLocation = new this.locationModel(location);

    const { coordinates, address } =
      await this.googleMapsService.getCoordinates({
        street: location.address,
        commune: location.commune,
      });

    createdLocation.address = address;
    createdLocation.geometry = {
      coordinates: coordinates as number[],
    } as GeoLocation;

    return createdLocation.save();
  }

  async getLocations(): Promise<Location[]> {
    return this.locationModel.find().exec();
  }

  async getGeoLocations(): Promise<GeoLocation[]> {
    return this.geoLocationModel.find().exec();
  }

  async getNearestGeoLocation(
    coordinates: [number, number],
    companyId: string,
  ): Promise<Location> {
    const location = await this.locationModel.findOne({
      $and: [
        { company: companyId },
        {
          geometry: {
            $near: {
              $geometry: { type: 'Point', coordinates },
              $maxDistance: 50000, // 50km
            },
          },
        },
      ],
    });
    return location;
  }

  // get nearest locations by coordinates and company id at radius 1km
  async getCompanyLocations(
    coordinates: [number, number],
    companyId: string,
  ): Promise<Location[]> {
    const locations = await this.locationModel.find({
      $and: [
        { company: companyId },
        {
          geometry: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates,
              },
              $maxDistance: 1000, // 1km
            },
          },
        },
      ],
    });
    return locations as Location[];
  }
}

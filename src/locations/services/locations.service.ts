import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Company } from 'src/companies/schemas/companies.schema';
import { GoogleMapsService } from 'src/google-maps/google-maps.service';
import { LocationDto } from '../dtos/locations.dto';
import { GeoLocation, Location } from '../schemas/locations.schema';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
    @InjectModel(GeoLocation.name) private geoLocationModel: Model<GeoLocation>,
    private readonly googleMapsService: GoogleMapsService,
  ) {}

  async createLocation(location: LocationDto): Promise<Location> {
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

  async createMany(
    locations: LocationDto[],
    company: Company,
  ): Promise<Location[]> {
    try {
      const locationsWithCompany = locations.map((location) => {
        return { ...location, company: company._id };
      });
      const createdLocations = await this.locationModel.insertMany(
        locationsWithCompany,
      );
      return createdLocations;
    } catch (error) {
      console.log(error);
      throw new HttpException("Can't create locations", 500);
    }
  }

  async getLocations(): Promise<Location[]> {
    return this.locationModel.find().exec();
  }

  async getGeoLocations(): Promise<GeoLocation[]> {
    return this.geoLocationModel.find().exec();
  }

  async getLocationsByCompany(companyId: string): Promise<Location[]> {
    return this.locationModel.find({ company: companyId });
  }

  async getNearestGeoLocation(
    coordinates: [number, number],
    companyId: string,
  ): Promise<Location> {
    const locations = await this.getCompanyLocationsCoords(
      coordinates,
      companyId,
    );
    return locations[0];
  }

  // get nearest locations by coordinates and company id at radius 1km
  async getCompanyLocationsCoords(
    coordinates: [number, number],
    companyId: string,
  ): Promise<Location[]> {
    if (!coordinates) {
      return this.getLocationsByCompany(companyId);
    }

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
            },
          },
        },
      ],
    });
    // sort locations by distance
    locations.sort((a, b) => {
      const distanceA = this.getDistanceFromLatLonInKm(
        coordinates[0],
        coordinates[1],
        a.geometry.coordinates[0],
        a.geometry.coordinates[1],
      );
      const distanceB = this.getDistanceFromLatLonInKm(
        coordinates[0],
        coordinates[1],
        b.geometry.coordinates[0],
        b.geometry.coordinates[1],
      );
      return distanceA - distanceB;
    });
    return locations as Location[];
  }

  private getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async removeMany(locations: Location[]) {
    // remove locations in bulk
    locations.forEach((location) => {
      location.remove();
    });
  }

  async removeLocationsByCompany(companyId: string) {
    const locations = await this.getLocationsByCompany(companyId);
    this.removeMany(locations);
  }
}

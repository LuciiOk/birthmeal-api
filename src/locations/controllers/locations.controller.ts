import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { GeoLocation, Location } from '../schemas/locations.schema';
import { LocationsService } from '../services/locations.service';
import { RegionService } from '../services/region.service';

@Controller('location')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly regionService: RegionService,
  ) {}

  @Post()
  async createLocation(@Body() location: Location): Promise<Location> {
    return this.locationsService.createLocation(location);
  }

  @Post('geo')
  async createGeoLocation(
    @Body() geoLocation: GeoLocation,
  ): Promise<GeoLocation> {
    return this.locationsService.createGeoLocation(geoLocation);
  }

  @Post('nearests/:companyId')
  async getNearestLocations(
    @Param('companyId') companyId: string,
    @Body('coordinates') coordinates: [number, number],
  ): Promise<Location[]> {
    console.log(companyId);
    return this.locationsService.getCompanyLocations(coordinates, companyId);
  }

  @Post('nearest/:companyId')
  async getNearestGeoLocation(
    @Body('coordinates') coordinates: [number, number],
    @Param('companyId') companyId: string,
  ): Promise<Location> {
    return this.locationsService.getNearestGeoLocation(coordinates, companyId);
  }

  @Get()
  async getLocations(): Promise<Location[]> {
    return this.locationsService.getLocations();
  }

  @Post('region')
  async createRegion(): Promise<any> {
    return this.regionService.createAll();
  }
}

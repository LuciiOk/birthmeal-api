import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { LocationDto } from '../dtos/locations.dto';
import { Location } from '../schemas/locations.schema';
import { LocationsService } from '../services/locations.service';
import { RegionService } from '../services/region.service';

@Controller('location')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly regionService: RegionService,
  ) {}

  @Post()
  async createLocation(@Body() location: LocationDto): Promise<Location> {
    return this.locationsService.createLocation(location);
  }

  @Post('nearests/:companyId')
  async getNearestLocations(
    @Param('companyId') companyId: string,
    @Body('coordinates') coordinates: [number, number],
  ): Promise<Location[]> {
    return this.locationsService.getCompanyLocationsCoords(coordinates, companyId);
  }

  @Post('nearest/:companyId')
  async getNearestGeoLocation(
    @Body('coordinates') coordinates: [number, number],
    @Param('companyId') companyId: string,
  ): Promise<Location> {
    return this.locationsService.getNearestGeoLocation(coordinates, companyId);
  }

  @Get(':companyId')
  async getCompanyLocations(@Param('companyId') companyId: string) {
    return this.locationsService.getLocationsByCompany(companyId);
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

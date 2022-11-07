import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { GeoLocation, Location } from '../schemas/locations.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocationsService } from '../services/locations.service';
import { RegionService } from '../services/region.service';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/schemas/auth.schema';
import { Roles } from 'src/auth/decorators/role.decorator';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('location')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly regionService: RegionService,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  async createLocation(@Body() location: Location): Promise<Location> {
    return this.locationsService.createLocation(location);
  }

  @Roles(Role.ADMIN)
  @Post('geo')
  async createGeoLocation(
    @Body() geoLocation: GeoLocation,
  ): Promise<GeoLocation> {
    return this.locationsService.createGeoLocation(geoLocation);
  }

  @Roles(Role.ADMIN)
  @Post('nearests/:companyId')
  async getNearestLocations(
    @Param('companyId') companyId: string,
    @Body('coordinates') coordinates: [number, number],
  ): Promise<Location[]> {
    console.log(companyId);
    return this.locationsService.getCompanyLocations(coordinates, companyId);
  }

  @Roles(Role.ADMIN)
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

  @Roles(Role.ADMIN)
  @Post('region')
  async createRegion(): Promise<any> {
    return this.regionService.createAll();
  }
}

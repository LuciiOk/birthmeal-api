import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesModule } from 'src/companies/companies.module';
import { GoogleMapsModule } from 'src/google-maps/google-maps.module';
import { LocationsController } from './controllers/locations.controller';
import {
  GeoLocationSchema,
  LocationSchema,
  Location,
  GeoLocation,
} from './schemas/locations.schema';
import { RegionSchema, Region } from './schemas/region.schema';
import { LocationsService } from './services/locations.service';
import { RegionService } from './services/region.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Location.name,
        schema: LocationSchema,
      },
      {
        name: GeoLocation.name,
        schema: GeoLocationSchema,
      },
      {
        name: Region.name,
        schema: RegionSchema,
      },
    ]),
    GoogleMapsModule,
  ],
  controllers: [LocationsController],
  providers: [LocationsService, RegionService],
  exports: [LocationsService, RegionService],
})
export class LocationsModule {}

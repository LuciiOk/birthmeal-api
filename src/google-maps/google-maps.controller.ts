import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GetCordinatesDto } from './dtos/Coordinates.dtop';
import { GoogleMapsService } from './google-maps.service';

@Controller('google-maps')
export class GoogleMapsController {
  constructor(private readonly googleMapsService: GoogleMapsService) {}

  @Post()
  async getCoordinates(@Body('address') address: GetCordinatesDto) {
    const coordinates = await this.googleMapsService.getCoordinates(address);
    return coordinates;
  }

  @Get(':name_place')
  async getPlace(@Param('name_place') name_place: string) {
    const place = await this.googleMapsService.getPlace(name_place);
    return place;
  }
}

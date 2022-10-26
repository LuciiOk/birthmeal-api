import { Controller, Get } from '@nestjs/common';
import { GoogleMapsService } from './google-maps.service';

@Controller('google-maps')
export class GoogleMapsController {
  constructor(private readonly googleMapsService: GoogleMapsService) {}

  @Get()
  async getCoordinates() {
    const coordinates = await this.googleMapsService.getCoordinates({
      address: 'Av. Providencia 1500',
      commune: 'Providencia',
      region: 'Santiago',
    });
    return coordinates;
  }
}

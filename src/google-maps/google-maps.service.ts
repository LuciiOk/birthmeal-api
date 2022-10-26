import { Client, LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleMapsService extends Client {
  private readonly accessKey = this.config.get('GOOGLE_MAPS_ACCESS_KEY');

  constructor(private config: ConfigService) {
    super();
  }
  // get coordinates by chilean address
  async getCoordinates({ address, commune, region }) {
    try {
      const { data } = await this.geocode({
        params: {
          address: `${address}, ${commune}, ${region}`,
          key: 'AIzaSyDsadPAbIgJa8JNvCGwPWVBY0NUn5MKcoE',
        },
      });
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } catch (error) {
      console.log(error);
      throw new HttpException('Error getting coordinates', 500);
    }
  }
}

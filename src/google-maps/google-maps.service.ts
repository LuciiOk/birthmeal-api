import { Client, LatLngLiteral } from '@googlemaps/google-maps-services-js';
import { HttpException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GoogleMapsService extends Client {
  constructor(@Inject('GOOGLE_MAPS') private accessKey: string) {
    super();
  }
  // get coordinates by chilean address
  async getCoordinates({ address, commune, region }): Promise<LatLngLiteral> {
    try {
      const { data } = await this.geocode({
        params: {
          address: `${address}, ${commune}, ${region}`,
          key: this.accessKey,
        },
      });
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng } as LatLngLiteral;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error getting coordinates', 500);
    }
  }
}

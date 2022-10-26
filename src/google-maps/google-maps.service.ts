import {
  Client,
  LatLngLiteral,
  PlaceInputType,
} from '@googlemaps/google-maps-services-js';
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

  // get all places by name and country without coordinates
  async getPlace(name_place: string): Promise<any> {
    try {
      const { data } = await this.placesNearby({
        params: {
          // coordinates of viña del mar
          location: { lat: -33.024, lng: -71.552 },
          radius: 1000000,
          keyword: name_place,
          key: this.accessKey,
        },
      });
      const { results } = data;
      return results;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error getting place', 500);
    }
  }
}

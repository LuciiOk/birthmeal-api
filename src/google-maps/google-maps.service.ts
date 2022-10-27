import {
  Client,
  LatLngLiteral,
  PlaceInputType,
} from '@googlemaps/google-maps-services-js';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Location } from 'src/locations/schemas/locations.schema';

@Injectable()
export class GoogleMapsService extends Client {
  constructor(@Inject('GOOGLE_MAPS') private accessKey: string) {
    super();
  }
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

  async getPlace(name_place: string): Promise<any> {
    try {
      const { data } = await this.placesNearby({
        params: {
          location: { lat: -33.024, lng: -71.552 },
          radius: 1000000,
          keyword: name_place,
          key: this.accessKey,
        },
      });
      const { results } = data;
      const places = results.map((place) => {
        const { geometry, name, vicinity: address, place_id: _id } = place;
        return {
          geometry,
          name,
          address,
          _id,
        };
      });
      return places;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error getting place', 500);
    }
  }

  async getStreet(coordinates: LatLngLiteral): Promise<any> {
    try {
      const { data } = await this.reverseGeocode({
        params: {
          latlng: coordinates,
          key: this.accessKey,
        },
      });
      // get commune, region and commune
      const { results } = data;
      const { address_components } = results[0];
      const street = address_components[0].long_name;
      const commune = address_components[1].long_name;
      const region = address_components[2].long_name;
      return {
        street,
        commune,
        region,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Error getting street', 500);
    }
  }
}

import { Client, LatLngLiteral, PlaceData } from '@googlemaps/google-maps-services-js';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { GetCordinatesDto } from './dtos/Coordinates.dtop';

@Injectable()
export class GoogleMapsService extends Client {
  constructor(@Inject('GOOGLE_MAPS') private accessKey: string) {
    super();
  }
  async getCoordinates({ street, commune }: GetCordinatesDto): Promise<any> {
    try {
      const address = `${street}`;
      const { data } = await this.geocode({
        params: {
          address: `${address}, ${commune}, Chile`,
          key: this.accessKey,
        },
      });
      const { results } = data;
      const { lat, lng } = results[0].geometry.location;
      return results
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
      const places = results.map(async (place) => {
        const {
          geometry: geometryA,
          name,
          vicinity: address,
          place_id: _id,
        } = place as PlaceData;

        const geometry = {
          coordinates: [geometryA.location.lng, geometryA.location.lat],
        };

        const {commune} = await this.getStreet({
          lat: geometryA.location.lat,
          lng: geometryA.location.lng,
        });
        return {
          geometry,
          name,
          address,
          _id,
          commune
        };
      });
      return Promise.all(places);
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
      const commune = address_components[2].long_name;
      const region = address_components[3].long_name;
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

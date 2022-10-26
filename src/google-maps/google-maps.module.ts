import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { GoogleMapsController } from './google-maps.controller';
import { GoogleMapsService } from './google-maps.service';
import config from 'src/config';
@Module({
  controllers: [GoogleMapsController],
  providers: [
    {
      provide: 'GOOGLE_MAPS',
      useFactory: (configService: ConfigType<typeof config>) => {
        return configService.googleMaps.accessKey;
      },
      inject: [config.KEY],
    },
    GoogleMapsService,
  ],
})
export class GoogleMapsModule {}

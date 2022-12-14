import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { LocationsModule } from './locations/locations.module';
import { CompaniesController } from './companies/controllers/companies/companies.controller';
import { enviroments } from './enviroments';
import { BirthdaysModule } from './birthdays/birthdays.module';

import config from './config';
import { DatabaseModule } from './database/database.module';
import { GoogleMapsModule } from './google-maps/google-maps.module';
import { RouterModule } from '@nestjs/core';
import { ImgurModule } from './imgur/imgur.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    RouterModule.register([
      { path: 'api', module: CompaniesModule },
      { path: 'api', module: LocationsModule },
      { path: 'api', module: AuthModule },
      { path: 'api', module: BirthdaysModule },
      { path: 'api', module: GoogleMapsModule },
      { path: 'api', module: AuthModule },
      { path: 'api', module: ImgurModule },
    ]),
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        MONGO_DB: Joi.string().required(),
        MONGO_INITDB_ROOT_USERNAME: Joi.string().required(),
        MONGO_INITDB_ROOT_PASSWORD: Joi.string().required(),
        GOOGLE_MAPS_ACCESS_KEY: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_AUTH_REDIRECT_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    CompaniesModule,
    LocationsModule,
    BirthdaysModule,
    GoogleMapsModule,
    ImgurModule,
    MailModule,
  ],
  controllers: [AppController, CompaniesController],
  providers: [],
})
export class AppModule {}

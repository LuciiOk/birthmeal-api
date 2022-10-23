import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { LocationsModule } from './locations/locations.module';
import { CompaniesController } from './companies/controllers/companies/companies.controller';
import { enviroments } from './enviroments';
import { BirthdaysModule } from './birthdays/birthdays.module';

import config from './config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
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
      }),
    }),
    DatabaseModule,
    AuthModule,
    CompaniesModule,
    LocationsModule,
    BirthdaysModule,
  ],
  controllers: [AppController, CompaniesController],
  providers: [AppService],
})
export class AppModule {}

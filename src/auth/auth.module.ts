import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { PassportModule } from '@nestjs/passport/dist';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigType } from '@nestjs/config';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Auth, AuthSchema } from './schemas/auth.schema';
import { Role, RoleSchema } from './schemas/role.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import config from 'src/config';
import { CompaniesModule } from 'src/companies/companies.module';
import { AdminStrategy } from './strategies/admin.strategy';
import { GoogleAuthController } from './controllers/google-auth.controller';
import { GoogleAuthService } from './services/google-auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([
      {
        name: Auth.name,
        schema: AuthSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    PassportModule,
    CompaniesModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => ({
        expiresIn: configService.jwt.expiresIn,
        secret: configService.jwt.secret,
      }),
    }),
  ],
  controllers: [AuthController, UserController, GoogleAuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    GoogleAuthService,
    GoogleStrategy,
    {
      provide: 'GOOGLE_AUTH',
      useFactory: (configService: ConfigType<typeof config>) => {
        return configService.googleAuth;
      },
      inject: [config.KEY],
    },
  ],
  exports: [AuthService, UserService],
})
export class AuthModule {}

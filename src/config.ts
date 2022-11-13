import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mongo: {
      dbName: process.env.MONGO_DB,
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      password: process.env.MONGO_INITDB_ROOT_PASSWORD,
      port: parseInt(process.env.MONGO_PORT, 10),
      host: process.env.MONGO_HOST,
      connection: process.env.MONGO_CONNECTION,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    googleMaps: {
      accessKey: process.env.GOOGLE_MAPS_ACCESS_KEY,
    },
    googleAuth: {
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_AUTH_REDIRECT_URI,
    },
  };
});

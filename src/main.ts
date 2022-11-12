import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Birthmeal API')
    .setDescription('API de Birthmeal, una aplicación para gestionar los cumpleaños de tus amigos y ademas encontrar lugares para celebrarlos con beneficios')
    .setVersion('2.0')
    .addTag('birthmeal')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/documentation', app, document);

  const port = process.env.PORT || 3000;
  // cors
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  // validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();

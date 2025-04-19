import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use('/uploads', express.static('uploads'));
  // Enable CORS
  app.enableCors({
    origin: ['https://sendpathy.aaa', 'https://api.sendpathy.aaa', 'https://dashboard.sendpathy.aaa'],
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
    credentials: true,
  });

  // Add prefix /api
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
    ],
  });

  // Increase payload size limit
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Sendpathy')
    .setDescription('The Sendpathy API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Use global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import bodyParser from 'body-parser';
import * as express from 'express';
import cookieParser from 'cookie-parser'; // Correct import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Use cookieParser correctly
  app.use('/uploads', express.static('uploads'));
  app.use('/assets', express.static('assets'));
  // Enable CORS
  app.enableCors({
    origin: ['https://sendpathy.aaa', 'https://api.sendpathy.aaa'], // Allow requests from your frontend domain
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
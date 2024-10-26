import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Enable CORS
    app.enableCors({  
      origin: '*',
      methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
    });
    // Add prefix /api
    app.setGlobalPrefix('api', {
      exclude: [
        { path: '/', method: RequestMethod.GET },
      ],
    });

    const config = new DocumentBuilder()
    .setTitle('Sendpathy')
    .setDescription('The Sendpathy API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());  
  await app.listen(3000);
}
bootstrap();

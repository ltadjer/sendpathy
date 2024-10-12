import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';

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

  app.useGlobalPipes(new ValidationPipe());  
  await app.listen(3000);
}
bootstrap();

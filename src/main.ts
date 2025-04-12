import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // แก้ปัญหา circular reference
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: false,
      enableImplicitConversion: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Coffee example')
    .setDescription('The Coffee API description')
    .setVersion('1.0')
    .addTag('coffee')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT ?? 5002);
}
bootstrap();

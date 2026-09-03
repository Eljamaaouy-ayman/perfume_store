import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true
  }))

  app.enableCors({
    origin: "http://localhost:3000"
  });

  const swagger = new DocumentBuilder()
  .setTitle("Perfume Store")
  .setDescription("Store Api Description")
  .addServer("http://localhost:3001")
  .setTermsOfService("http://localhost:3000/terms-of-service")
  .addSecurity('bearer', {type: 'http', scheme: 'bearer'})
  .addBearerAuth()
  .setVersion("1.0")
  .build()
  const documentation = SwaggerModule.createDocument(app, swagger)
  SwaggerModule.setup('swagger', app, documentation)

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

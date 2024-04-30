import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import validationOptions from '@/utils/validation-options'
import { ResolvePromisesInterceptor } from '@utils/serializer.interceptor'
import { useContainer } from 'class-validator'
import * as serveStatic from 'serve-static'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', allowedHeaders: 'Content-Type, Accept' })
  app.setGlobalPrefix('api/v1')
  app.useGlobalPipes(new ValidationPipe(validationOptions))
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.useGlobalInterceptors(new ResolvePromisesInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)))
  app.use('/uploads', serveStatic('uploads'))
  await app.listen(3001)
}
void bootstrap()

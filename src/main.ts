import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import validationOptions from '@/utils/validation-options'
import { ResolvePromisesInterceptor } from '@utils/serializer.interceptor'
import { useContainer } from 'class-validator'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api/v1')
  app.useGlobalPipes(new ValidationPipe(validationOptions))
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.useGlobalInterceptors(new ResolvePromisesInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)))
  await app.listen(3001)
}
void bootstrap()

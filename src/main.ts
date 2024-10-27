import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { json, urlencoded } from 'express'
import { ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true })
  const config = app.get(ConfigService)

  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'cdn.redoc.ly', "'unsafe-inline'"],
        workerSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'cdn.redoc.ly', 'data:'],
      },
    }),
  )
  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: config.getOrThrow('app.allowedOrigins'),
    credentials: true,
  })
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  await app.listen(config.getOrThrow('app.port'), async () => {
    console.info(
      process.env.NODE_ENV,
      `server is Running on ${config.getOrThrow('app.port')}`,
    )
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap()

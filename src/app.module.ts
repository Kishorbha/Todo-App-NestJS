import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MainModule } from './modules/main.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import config from './config'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { GlobalExceptionFilter } from './filters/global.filter'
import { TransformPipe } from './pipes/data-transform.pipe'
import { MongooseModule } from '@nestjs/mongoose'
import { PaginateQueries } from './middlewares/paginate-queries.middleware'
import { AppController } from './app.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: config,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => {
        return {
          uri: ConfigService.getOrThrow('app.databaseUri'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      },
    }),
    MainModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_PIPE, useClass: TransformPipe },
  ],
})
export class AppModule implements NestModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginateQueries).forRoutes('*')
  }
}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { envValidationSchema } from './config/env.validation';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AdminAuthModule } from './modules/admin-auth/admin-auth.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { HealthModule } from './modules/health/health.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ProgressModule } from './modules/progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envValidationSchema,
    }),
    PrismaModule,
    HealthModule,
    AdminAuthModule,
    CategoriesModule,
    LessonsModule,
    ProgressModule,
    BookmarksModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}

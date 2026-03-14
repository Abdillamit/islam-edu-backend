import { Module } from '@nestjs/common';
import { AdminLessonsController } from './admin-lessons.controller';
import { LessonsController } from './lessons.controller';
import { LessonsRepository } from './lessons.repository';
import { LessonsService } from './lessons.service';

@Module({
  controllers: [LessonsController, AdminLessonsController],
  providers: [LessonsService, LessonsRepository],
  exports: [LessonsService],
})
export class LessonsModule {}

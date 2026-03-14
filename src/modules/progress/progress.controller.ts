import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeviceIdGuard } from '../../common/guards/device-id.guard';
import { DeviceRequest } from '../../common/interfaces/device-request.interface';
import { MarkLessonCompletedDto } from './dto/mark-lesson-completed.dto';
import { ProgressQueryDto } from './dto/progress-query.dto';
import { ProgressService } from './progress.service';

@UseGuards(DeviceIdGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('complete')
  markCompleted(
    @Req() request: DeviceRequest,
    @Body() dto: MarkLessonCompletedDto,
  ) {
    return this.progressService.markLessonCompleted(request.deviceId, dto);
  }

  @Get('completed')
  getCompletedLessons(
    @Req() request: DeviceRequest,
    @Query() query: ProgressQueryDto,
  ) {
    return this.progressService.getCompletedLessons(request.deviceId, query);
  }

  @Get('summary')
  getProgressSummary(
    @Req() request: DeviceRequest,
    @Query('lang') lang?: string,
  ) {
    return this.progressService.getProgressSummary(request.deviceId, lang);
  }
}

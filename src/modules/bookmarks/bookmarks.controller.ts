import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeviceIdGuard } from '../../common/guards/device-id.guard';
import { DeviceRequest } from '../../common/interfaces/device-request.interface';
import { AddBookmarkDto } from './dto/add-bookmark.dto';
import { BookmarkQueryDto } from './dto/bookmark-query.dto';
import { BookmarksService } from './bookmarks.service';

@UseGuards(DeviceIdGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  getBookmarks(
    @Req() request: DeviceRequest,
    @Query() query: BookmarkQueryDto,
  ) {
    return this.bookmarksService.getBookmarks(request.deviceId, query);
  }

  @Post()
  addBookmark(@Req() request: DeviceRequest, @Body() dto: AddBookmarkDto) {
    return this.bookmarksService.addBookmark(request.deviceId, dto);
  }

  @Delete(':lessonId')
  removeBookmark(
    @Req() request: DeviceRequest,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ) {
    return this.bookmarksService.removeBookmark(request.deviceId, lessonId);
  }
}

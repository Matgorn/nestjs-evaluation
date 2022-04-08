import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';

import DatabaseFile from './entities/db-file.entity';
import { DbFileService } from './db-file.service';

@Controller('db-file')
export class DbFileController {
  constructor(private readonly dbFileService: DbFileService) {}

  @Get(':id')
  async getDbFileById(
    @Res({ passthrough: true }) res: Response,
    @Param('id', ParseIntPipe) id: DatabaseFile['id'],
  ) {
    const file = await this.dbFileService.getFileById(id);
    const stream = Readable.from(file.data);

    res.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'image',
    });

    return new StreamableFile(stream);
  }
}

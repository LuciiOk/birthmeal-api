import { Module } from '@nestjs/common';
import { ImgurService } from './imgur.service';
import { ImgurController } from './imgur.controller';

@Module({
  providers: [ImgurService],
  controllers: [ImgurController],
})
export class ImgurModule {}

import { Controller, Post, Get, Delete, Body, Req, Header, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ImgurService } from './imgur.service';

@Controller('imgur')
export class ImgurController {

  constructor(private readonly imgurService: ImgurService) {}

  // receive an image from the client and upload it to imgur => 'content-type': 
  @Post() 
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.imgurService.uploadImage(file.buffer);
    return imageUrl;
  }

  // @Get()
  // async getImage() {
  //   return await this.imgurService.getImage();
  // }

  // @Delete()
  // async deleteImage() {
  //   return await this.imgurService.deleteImage();
  // }
}

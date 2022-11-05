import { Injectable } from '@nestjs/common';

import { ImgurClient } from 'imgur';
import { createReadStream } from 'fs';

@Injectable()
export class ImgurService {
  private imgurClient = new ImgurClient({
    clientId: 'b01aa5497765c52',
    clientSecret: 'f3e4b43b25db49417f08f48ec05240073c3c5c8d',
  });

  constructor() {}

  async uploadImage(imageData: Buffer) {
    const imageBuffer = imageData;

    const {
      data: { link },
    } = await this.imgurClient.upload({
      image: imageBuffer,
      title: 'test',
    });
    return link;
  }
}

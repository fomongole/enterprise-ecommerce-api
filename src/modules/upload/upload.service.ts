import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  async uploadStream(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'ecommerce_products' },
        (error, result) => {
          // Handle the case where result is undefined (TS18048)
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary upload failed'));

          resolve(result.secure_url);
        },
      );

      stream.pipe(uploadStream);
    });
  }
}

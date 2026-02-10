import {
  Controller,
  Post,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async uploadImage(@Req() req: FastifyRequest) {
    // Check if req.file exists or cast req to any to bypass TS2339
    // The .file() method is added dynamically by @fastify/multipart
    const data = await (req as any).file();

    if (!data) {
      throw new BadRequestException('No file uploaded');
    }

    // Pass the stream directly to the service
    const url = await this.uploadService.uploadStream(data.file);
    return { url };
  }
}

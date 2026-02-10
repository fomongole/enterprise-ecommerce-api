import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async log(
    user: User | null,
    action: string,
    resourceId?: string,
    details?: string,
    ipAddress: string = '0.0.0.0',
  ): Promise<AuditLog> {
    const log = this.auditRepo.create({
      userId: user?.id, // Can be null for system actions
      action,
      resourceId,
      details,
      ipAddress,
    });

    return this.auditRepo.save(log);
  }

  // Admin feature: View all logs
  async findAll(): Promise<AuditLog[]> {
    return this.auditRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}

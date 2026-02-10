import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditLog } from './entities/audit-log.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Resolver(() => AuditLog)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AuditResolver {
  constructor(private readonly auditService: AuditService) {}

  @Query(() => [AuditLog], { name: 'auditLogs' })
  async getAuditLogs() {
    return this.auditService.findAll();
  }
}

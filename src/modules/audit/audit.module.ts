import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditService } from './audit.service';
import { AuditResolver } from './audit.resolver';

@Global() // Making it Global so we don't have to import it everywhere
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditService, AuditResolver],
  exports: [AuditService],
})
export class AuditModule {}

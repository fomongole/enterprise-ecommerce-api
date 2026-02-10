import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Field()
  @Column()
  action: string; // e.g., "CREATE_PRODUCT", "DELETE_ORDER"

  @Field({ nullable: true })
  @Column({ nullable: true })
  resourceId?: string; // e.g., The ID of the product changed

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  details?: string; // JSON string of what changed (e.g., "Old Price: 10, New: 20")

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Field({ nullable: true })
  @Column({ nullable: true })
  userId?: string;

  @Field()
  @Column()
  ipAddress: string;
}

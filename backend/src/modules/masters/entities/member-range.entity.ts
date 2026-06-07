import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('member_ranges')
export class MemberRange extends BaseEntity {
  // Text shown in the dropdown, e.g. "50 – 150 members".
  @Column({ type: 'varchar', length: 100 })
  label!: string;

  // Short unique code, e.g. "50_150".
  @Column({ type: 'varchar', length: 20, unique: true })
  code!: string;

  // Lower bound of the range.
  @Column({ type: 'int' })
  minValue!: number;

  // Upper bound. NULL means "and above" (e.g. 500+ members).
  @Column({ type: 'int', nullable: true })
  maxValue!: number | null;
}

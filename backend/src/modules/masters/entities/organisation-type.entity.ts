import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

// @Entity('organisation_types') = this class maps to a table called organisation_types.
// It extends BaseEntity, so it automatically gets id + all audit columns.
@Entity('organisation_types')
export class OrganisationType extends BaseEntity {
  // The label shown in the dropdown, e.g. "Farmer Producer Company (FPC)".
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  // A short, unique code used in seed scripts and lookups, e.g. "FPC".
  @Column({ type: 'varchar', length: 20, unique: true })
  code!: string;
}

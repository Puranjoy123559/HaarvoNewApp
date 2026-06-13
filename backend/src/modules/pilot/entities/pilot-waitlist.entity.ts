import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { State } from '../../masters/entities/state.entity';
import { District } from '../../masters/entities/district.entity';
import { Crop } from '../../masters/entities/crop.entity';

// One row = one FPO that applied to the Phase 1 pilot waitlist.
// Table name will be "pilot_waitlists" (snake_case + plural, same as our
// other tables). The id, isActive, isDeleted, createdOn etc. all come from
// BaseEntity, so we only add the columns that are special to this table.
@Entity('pilot_waitlists')
export class PilotWaitlist extends BaseEntity {
  // ===== Required fields =====

  // Person's full name as typed in the form.
  @Column({ type: 'varchar', length: 150 })
  fullName!: string;

  // Country code for the phone number, e.g. "+91". Defaults to "+91".
  @Column({ type: 'varchar', length: 5, default: '+91' })
  countryCode!: string;

  // The 10-digit mobile number. "unique" means PostgreSQL itself will block
  // a second row with the same number — an extra safety net on top of the
  // duplicate check we do in the service.
  @Column({ type: 'varchar', length: 15, unique: true })
  mobileNumber!: string;

  // FPO / Organisation name typed in the form.
  @Column({ type: 'varchar', length: 200 })
  organisationName!: string;

  // ===== Location (cascading State -> District, same masters tables) =====

  // Foreign key column: which state was selected.
  @Column({ type: 'int' })
  stateId!: number;

  // Navigation property (like a navigation property in EF Core).
  @ManyToOne(() => State)
  @JoinColumn({ name: 'state_id' })
  state!: State;

  // Foreign key column: which district was selected.
  @Column({ type: 'int' })
  districtId!: number;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district!: District;

  // ===== Optional field =====

  // Primary crop is optional, so it can be null.
  @Column({ type: 'int', nullable: true })
  primaryCropId!: number | null;

  @ManyToOne(() => Crop)
  @JoinColumn({ name: 'primary_crop_id' })
  primaryCrop!: Crop | null;
}

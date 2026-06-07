import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { OrganisationType } from '../../masters/entities/organisation-type.entity';
import { State } from '../../masters/entities/state.entity';
import { District } from '../../masters/entities/district.entity';
import { MemberRange } from '../../masters/entities/member-range.entity';
import { Crop } from '../../masters/entities/crop.entity';
import { PromotingAgency } from '../../masters/entities/promoting-agency.entity';

@Entity('organisations')
export class Organisation extends BaseEntity {
  // ===== Required fields =====

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'int' })
  organisationTypeId!: number;

  @ManyToOne(() => OrganisationType)
  @JoinColumn({ name: 'organisation_type_id' })
  organisationType!: OrganisationType;

  @Column({ type: 'varchar', length: 50, unique: true })
  registrationNumber!: string;

  @Column({ type: 'int' })
  stateId!: number;

  @ManyToOne(() => State)
  @JoinColumn({ name: 'state_id' })
  state!: State;

  @Column({ type: 'int' })
  districtId!: number;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district!: District;

  // ===== Optional fields =====

  @Column({ type: 'int', nullable: true })
  yearOfRegistration!: number | null;

  @Column({ type: 'int', nullable: true })
  memberRangeId!: number | null;

  @ManyToOne(() => MemberRange)
  @JoinColumn({ name: 'member_range_id' })
  memberRange!: MemberRange | null;

  @Column({ type: 'int', nullable: true })
  primaryCropId!: number | null;

  @ManyToOne(() => Crop)
  @JoinColumn({ name: 'primary_crop_id' })
  primaryCrop!: Crop | null;

  @Column({ type: 'int', nullable: true })
  promotingAgencyId!: number | null;

  @ManyToOne(() => PromotingAgency)
  @JoinColumn({ name: 'promoting_agency_id' })
  promotingAgency!: PromotingAgency | null;
}

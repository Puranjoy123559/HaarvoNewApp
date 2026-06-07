import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { State } from './state.entity';

@Entity('districts')
export class District extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code!: string;

  // Foreign key column: which state this district belongs to.
  // This is the column we will store in the user registration later.
  @Column({ type: 'int' })
  stateId!: number;

  // The relation object. ManyToOne = "many districts belong to one state".
  // Same as a navigation property in EF Core.
  @ManyToOne(() => State)
  @JoinColumn({ name: 'state_id' })
  state!: State;
}

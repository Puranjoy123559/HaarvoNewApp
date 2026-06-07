import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  // Auto-increment primary key, starts at 1 and increases by 1.
  // Same as [Key] + IDENTITY(1,1) in SQL Server.
  @PrimaryGeneratedColumn()
  id!: number;

  // Used to enable/disable a row without deleting it (e.g. hide a dropdown value).
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  // Soft delete flag — we never physically delete rows, we just set this to true.
  @Column({ type: 'boolean', default: false })
  isDeleted!: boolean;

  // Automatically set to the current time when the row is first created.
  @CreateDateColumn({ type: 'timestamp' })
  createdOn!: Date;

  // Which user created this row. Nullable for now (no users yet).
  @Column({ type: 'int', nullable: true })
  createdBy!: number | null;

  // Automatically updated to the current time whenever the row changes.
  @UpdateDateColumn({ type: 'timestamp' })
  updatedOn!: Date;

  // Which user last updated this row. Nullable for now.
  @Column({ type: 'int', nullable: true })
  updatedBy!: number | null;
}

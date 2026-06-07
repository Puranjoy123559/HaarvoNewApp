import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organisation } from './entities/organisation.entity';

// Registers the Organisation entity so TypeORM creates the table.
// We export TypeOrmModule so other modules (e.g. auth, when we build it)
// can inject the Organisation repository if they need it.
@Module({
  imports: [TypeOrmModule.forFeature([Organisation])],
  exports: [TypeOrmModule],
})
export class OrganisationsModule {}

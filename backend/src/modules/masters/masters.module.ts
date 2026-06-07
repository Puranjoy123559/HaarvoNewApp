import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationType } from './entities/organisation-type.entity';
import { State } from './entities/state.entity';
import { District } from './entities/district.entity';
import { Crop } from './entities/crop.entity';
import { Designation } from './entities/designation.entity';
import { Language } from './entities/language.entity';
import { PromotingAgency } from './entities/promoting-agency.entity';
import { MemberRange } from './entities/member-range.entity';
import { MastersController } from './masters.controller';
import { MastersService } from './masters.service';
import { MastersRepository } from './repositories/masters.repository';

// A NestJS module is like a feature area / Module in .NET.
// It declares everything that belongs to this feature:
//   - imports     = other modules / entities it uses
//   - controllers = HTTP endpoints
//   - providers   = services + repositories (the things that can be injected)
@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganisationType,
      State,
      District,
      Crop,
      Designation,
      Language,
      PromotingAgency,
      MemberRange,
    ]),
  ],
  controllers: [MastersController],
  providers: [MastersService, MastersRepository],
})
export class MastersModule {}

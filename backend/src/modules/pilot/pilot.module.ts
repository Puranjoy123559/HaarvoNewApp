import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PilotWaitlist } from './entities/pilot-waitlist.entity';
import { PilotController } from './pilot.controller';
import { PilotService } from './pilot.service';
import { PilotRepository } from './repositories/pilot.repository';

// Registers everything for the pilot feature. forFeature([PilotWaitlist])
// is what makes TypeORM create the pilot_waitlists table on startup.
@Module({
  imports: [TypeOrmModule.forFeature([PilotWaitlist])],
  controllers: [PilotController],
  providers: [PilotService, PilotRepository],
})
export class PilotModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PilotWaitlist } from '../entities/pilot-waitlist.entity';

// The data-access layer — the only place that talks to the database for
// this feature (same role as a Repository class in .NET).
@Injectable()
export class PilotRepository {
  constructor(
    @InjectRepository(PilotWaitlist)
    private readonly waitlistRepo: Repository<PilotWaitlist>,
  ) {}

  // Used to block duplicate mobile numbers.
  findByMobile(mobileNumber: string): Promise<PilotWaitlist | null> {
    return this.waitlistRepo.findOne({
      where: { mobileNumber, isDeleted: false },
    });
  }

  // Builds a new entity object and saves it (INSERT).
  create(data: Partial<PilotWaitlist>): Promise<PilotWaitlist> {
    const entity = this.waitlistRepo.create(data);
    return this.waitlistRepo.save(entity);
  }
}

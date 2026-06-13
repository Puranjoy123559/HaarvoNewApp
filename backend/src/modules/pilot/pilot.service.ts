import { Injectable, ConflictException } from '@nestjs/common';
import { PilotRepository } from './repositories/pilot.repository';
import { IPilotService } from './interfaces/pilot.service.interface';
import { CreatePilotWaitlistDto } from './dtos/create-pilot-waitlist.dto';
import { PilotWaitlistResponseDto } from './dtos/pilot-waitlist-response.dto';

@Injectable()
export class PilotService implements IPilotService {
  constructor(private readonly repository: PilotRepository) {}

  async createWaitlistEntry(
    dto: CreatePilotWaitlistDto,
  ): Promise<PilotWaitlistResponseDto> {
    // 1) No duplicate mobile numbers allowed.
    const existing = await this.repository.findByMobile(dto.mobileNumber);
    if (existing) {
      // 409 Conflict — the frontend shows this message on the mobile field.
      throw new ConflictException(
        'This mobile number is already on the waitlist',
      );
    }

    // 2) Save the new row.
    const saved = await this.repository.create({
      fullName: dto.fullName.trim(),
      countryCode: dto.countryCode,
      mobileNumber: dto.mobileNumber,
      organisationName: dto.organisationName.trim(),
      stateId: dto.stateId,
      districtId: dto.districtId,
      primaryCropId: dto.primaryCropId ?? null,
    });

    // 3) Return a simple success result.
    return {
      id: saved.id,
      message:
        'Thanks! Your details are on the waitlist. Our team will reach out in few days.',
    };
  }
}

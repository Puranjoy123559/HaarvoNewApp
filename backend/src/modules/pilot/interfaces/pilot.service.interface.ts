import { CreatePilotWaitlistDto } from '../dtos/create-pilot-waitlist.dto';
import { PilotWaitlistResponseDto } from '../dtos/pilot-waitlist-response.dto';

export interface IPilotService {
  createWaitlistEntry(
    dto: CreatePilotWaitlistDto,
  ): Promise<PilotWaitlistResponseDto>;
}

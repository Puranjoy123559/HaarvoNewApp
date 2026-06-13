import { Body, Controller, Post } from '@nestjs/common';
import { PilotService } from './pilot.service';
import { CreatePilotWaitlistDto } from './dtos/create-pilot-waitlist.dto';

// All routes here start with /pilot (plus the global /api/v1 prefix).
@Controller('pilot')
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  // POST /api/v1/pilot/waitlist
  @Post('waitlist')
  createWaitlistEntry(@Body() dto: CreatePilotWaitlistDto) {
    return this.pilotService.createWaitlistEntry(dto);
  }
}

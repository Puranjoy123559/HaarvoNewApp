import { Controller, Get, Query } from '@nestjs/common';
import { MastersService } from './masters.service';
import { GetDistrictsQueryDto } from './dtos/get-districts-query.dto';

@Controller('masters')
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  @Get('organisation-types')
  getOrganisationTypes() {
    return this.mastersService.getOrganisationTypes();
  }

  @Get('states')
  getStates() {
    return this.mastersService.getStates();
  }

  @Get('districts')
  getDistricts(@Query() query: GetDistrictsQueryDto) {
    return this.mastersService.getDistricts(query.stateId);
  }

  @Get('crops')
  getCrops() {
    return this.mastersService.getCrops();
  }

  @Get('designations')
  getDesignations() {
    return this.mastersService.getDesignations();
  }

  @Get('languages')
  getLanguages() {
    return this.mastersService.getLanguages();
  }

  @Get('promoting-agencies')
  getPromotingAgencies() {
    return this.mastersService.getPromotingAgencies();
  }

  @Get('member-ranges')
  getMemberRanges() {
    return this.mastersService.getMemberRanges();
  }
}

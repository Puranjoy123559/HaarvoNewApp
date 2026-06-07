import { Injectable } from '@nestjs/common';
import { MastersRepository } from './repositories/masters.repository';
import { IMastersService } from './interfaces/masters.service.interface';
import { DropdownOptionDto } from './dtos/dropdown-option.dto';
import { DistrictDto } from './dtos/district.dto';
import { MemberRangeDto } from './dtos/member-range.dto';

@Injectable()
export class MastersService implements IMastersService {
  constructor(private readonly repository: MastersRepository) {}

  async getOrganisationTypes(): Promise<DropdownOptionDto[]> {
    const items = await this.repository.findOrganisationTypes();
    return items.map((item) => this.toDropdownOption(item));
  }

  async getStates(): Promise<DropdownOptionDto[]> {
    const items = await this.repository.findStates();
    return items.map((item) => this.toDropdownOption(item));
  }

  async getDistricts(stateId: number): Promise<DistrictDto[]> {
    const items = await this.repository.findDistrictsByStateId(stateId);
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      code: item.code,
      stateId: item.stateId,
    }));
  }

  async getCrops(): Promise<DropdownOptionDto[]> {
    const items = await this.repository.findCrops();
    return items.map((item) => this.toDropdownOption(item));
  }

  async getDesignations(): Promise<DropdownOptionDto[]> {
    const items = await this.repository.findDesignations();
    return items.map((item) => this.toDropdownOption(item));
  }

  async getLanguages(): Promise<DropdownOptionDto[]> {
    const items = await this.repository.findLanguages();
    return items.map((item) => this.toDropdownOption(item));
  }

  async getPromotingAgencies(): Promise<DropdownOptionDto[]> {
    const items = await this.repository.findPromotingAgencies();
    return items.map((item) => this.toDropdownOption(item));
  }

  async getMemberRanges(): Promise<MemberRangeDto[]> {
    const items = await this.repository.findMemberRanges();
    return items.map((item) => ({
      id: item.id,
      label: item.label,
      code: item.code,
      minValue: item.minValue,
      maxValue: item.maxValue,
    }));
  }

  private toDropdownOption(entity: {
    id: number;
    name: string;
    code: string;
  }): DropdownOptionDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
    };
  }
}

import { DropdownOptionDto } from '../dtos/dropdown-option.dto';
import { DistrictDto } from '../dtos/district.dto';
import { MemberRangeDto } from '../dtos/member-range.dto';

// The contract that MastersService must implement.
// Same idea as IMastersService in C#.
export interface IMastersService {
  getOrganisationTypes(): Promise<DropdownOptionDto[]>;
  getStates(): Promise<DropdownOptionDto[]>;
  getDistricts(stateId: number): Promise<DistrictDto[]>;
  getCrops(): Promise<DropdownOptionDto[]>;
  getDesignations(): Promise<DropdownOptionDto[]>;
  getLanguages(): Promise<DropdownOptionDto[]>;
  getPromotingAgencies(): Promise<DropdownOptionDto[]>;
  getMemberRanges(): Promise<MemberRangeDto[]>;
}

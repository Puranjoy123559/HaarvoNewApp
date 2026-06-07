import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganisationType } from '../entities/organisation-type.entity';
import { State } from '../entities/state.entity';
import { District } from '../entities/district.entity';
import { Crop } from '../entities/crop.entity';
import { Designation } from '../entities/designation.entity';
import { Language } from '../entities/language.entity';
import { PromotingAgency } from '../entities/promoting-agency.entity';
import { MemberRange } from '../entities/member-range.entity';

@Injectable()
export class MastersRepository {
  constructor(
    @InjectRepository(OrganisationType)
    private readonly organisationTypeRepo: Repository<OrganisationType>,

    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,

    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,

    @InjectRepository(Crop)
    private readonly cropRepo: Repository<Crop>,

    @InjectRepository(Designation)
    private readonly designationRepo: Repository<Designation>,

    @InjectRepository(Language)
    private readonly languageRepo: Repository<Language>,

    @InjectRepository(PromotingAgency)
    private readonly promotingAgencyRepo: Repository<PromotingAgency>,

    @InjectRepository(MemberRange)
    private readonly memberRangeRepo: Repository<MemberRange>,
  ) {}

  private readonly activeFilter = { isActive: true, isDeleted: false };

  findOrganisationTypes(): Promise<OrganisationType[]> {
    return this.organisationTypeRepo.find({
      where: this.activeFilter,
      order: { name: 'ASC' },
    });
  }

  findStates(): Promise<State[]> {
    return this.stateRepo.find({
      where: this.activeFilter,
      order: { name: 'ASC' },
    });
  }

  findDistrictsByStateId(stateId: number): Promise<District[]> {
    return this.districtRepo.find({
      where: { ...this.activeFilter, stateId },
      order: { name: 'ASC' },
    });
  }

  findCrops(): Promise<Crop[]> {
    return this.cropRepo.find({
      where: this.activeFilter,
      order: { name: 'ASC' },
    });
  }

  findDesignations(): Promise<Designation[]> {
    return this.designationRepo.find({
      where: this.activeFilter,
      order: { name: 'ASC' },
    });
  }

  findLanguages(): Promise<Language[]> {
    return this.languageRepo.find({
      where: this.activeFilter,
      order: { name: 'ASC' },
    });
  }

  findPromotingAgencies(): Promise<PromotingAgency[]> {
    return this.promotingAgencyRepo.find({
      where: this.activeFilter,
      order: { name: 'ASC' },
    });
  }

  findMemberRanges(): Promise<MemberRange[]> {
    // Ordered by minValue so smallest range appears first.
    return this.memberRangeRepo.find({
      where: this.activeFilter,
      order: { minValue: 'ASC' },
    });
  }
}

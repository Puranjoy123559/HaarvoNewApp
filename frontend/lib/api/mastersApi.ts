import { apiGet } from "./apiClient";
import { DropdownOption, District, MemberRange } from "@/types/api";

export const mastersApi = {
  getOrganisationTypes: () =>
    apiGet<DropdownOption[]>("/masters/organisation-types"),

  getStates: () => apiGet<DropdownOption[]>("/masters/states"),

  getDistricts: (stateId: number) =>
    apiGet<District[]>(`/masters/districts?stateId=${stateId}`),

  getCrops: () => apiGet<DropdownOption[]>("/masters/crops"),

  getDesignations: () => apiGet<DropdownOption[]>("/masters/designations"),

  getLanguages: () => apiGet<DropdownOption[]>("/masters/languages"),

  getPromotingAgencies: () =>
    apiGet<DropdownOption[]>("/masters/promoting-agencies"),

  getMemberRanges: () => apiGet<MemberRange[]>("/masters/member-ranges"),
};
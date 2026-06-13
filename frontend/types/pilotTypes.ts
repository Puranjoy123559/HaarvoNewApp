// ===== Shapes sent to / received from the backend =====

export interface PilotWaitlistRequest {
  fullName: string;
  countryCode: string;
  mobileNumber: string;
  organisationName: string;
  stateId: number;
  districtId: number;
  primaryCropId?: number; // optional
}

export interface PilotWaitlistResponse {
  id: number;
  message: string;
}

// ===== The form data the modal keeps in state =====
// All values are strings here because that's what HTML inputs/selects give us.
// We convert the id strings to numbers right before sending to the backend.
export interface PilotFormData {
  fullName: string;
  countryCode: string;
  mobileNumber: string;
  organisationName: string;
  state: string; // selected state id, as a string
  district: string; // selected district id, as a string
  primaryCrop: string; // selected crop id, as a string (optional)
}

export const getEmptyPilotForm = (): PilotFormData => ({
  fullName: "",
  countryCode: "+91",
  mobileNumber: "",
  organisationName: "",
  state: "",
  district: "",
  primaryCrop: "",
});
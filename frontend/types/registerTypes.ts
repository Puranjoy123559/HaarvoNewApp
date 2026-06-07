export interface RegisterFormData {
  organisationName: string;
  organisationType: string;
  registrationNumber: string;
  yearOfRegistration: string;
  state: string;
  district: string;
  memberCount: string;
  primaryCrop: string;
  firstName: string;
  lastName: string;
  email: string;          
  designation: string;
  countryCode: string;
  mobileNumber: string;
  language: string;
  promotingAgency: string;
  agreedToTerms: boolean;
}

export const getEmptyRegisterForm = (): RegisterFormData => ({
  organisationName: "",
  organisationType: "",
  registrationNumber: "",
  yearOfRegistration: "",
  state: "",
  district: "",
  memberCount: "",
  primaryCrop: "",
  firstName: "",
  lastName: "",
  email: "",              
  countryCode: "+91",
  designation: "",
  mobileNumber: "",
  language: "EN",
  promotingAgency: "NONE",
  agreedToTerms: false,
});
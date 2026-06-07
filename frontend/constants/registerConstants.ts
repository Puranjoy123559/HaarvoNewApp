// This file holds placeholder values for dropdowns.
// TODO: Replace these with API calls to backend once endpoints are ready.
// Example future code: fetch("/api/organisation-types").then(...)

// Each dropdown option has a "value" (sent to backend) and a "label" (shown to user).
// This is the same pattern as a C# enum + display name.

export const ORGANISATION_TYPES = [
  { value: "", label: "Select type" },
  { value: "FPC", label: "Farmer Producer Company (FPC)" },
  { value: "COOPERATIVE", label: "Cooperative Society" },
  { value: "SHG", label: "Self Help Group (SHG)" },
  { value: "TRUST", label: "Trust / NGO" },
  { value: "PRIVATE_LTD", label: "Private Limited" },
];

export const INDIAN_STATES = [
  { value: "", label: "Select state" },
  { value: "ASSAM", label: "Assam" },
  { value: "MEGHALAYA", label: "Meghalaya" },
  { value: "ARUNACHAL", label: "Arunachal Pradesh" },
  { value: "NAGALAND", label: "Nagaland" },
  { value: "MANIPUR", label: "Manipur" },
  { value: "MIZORAM", label: "Mizoram" },
  { value: "TRIPURA", label: "Tripura" },
  { value: "SIKKIM", label: "Sikkim" },
];

export const MEMBER_COUNT_RANGES = [
  { value: "", label: "Select range" },
  { value: "0-50", label: "Less than 50 members" },
  { value: "50-150", label: "50 – 150 members" },
  { value: "150-500", label: "150 – 500 members" },
  { value: "500+", label: "500+ members" },
];

export const PRIMARY_CROPS = [
  { value: "", label: "Select primary crop" },
  { value: "GINGER", label: "Ginger" },
  { value: "TURMERIC", label: "Turmeric" },
  { value: "BLACK_PEPPER", label: "Black Pepper" },
  { value: "TEA", label: "Tea" },
  { value: "RICE", label: "Rice" },
  { value: "OTHER", label: "Other" },
];

export const DESIGNATIONS = [
  { value: "", label: "Select designation" },
  { value: "CEO", label: "CEO / Chief Executive" },
  { value: "CHAIRMAN", label: "Chairman" },
  { value: "DIRECTOR", label: "Director" },
  { value: "MANAGER", label: "Manager" },
  { value: "SECRETARY", label: "Secretary" },
];

export const LANGUAGES = [
  { value: "EN", label: "English" },
  { value: "HI", label: "Hindi" },
  { value: "AS", label: "Assamese" },
  { value: "BN", label: "Bengali" },
];

export const PROMOTING_AGENCIES = [
  { value: "NONE", label: "None / not sure" },
  { value: "NABARD", label: "NABARD" },
  { value: "ARIAS", label: "ARIAS Society" },
  { value: "SFAC", label: "SFAC" },
  { value: "OTHER", label: "Other" },
];

export const COUNTRY_CODES = [
  { value: "+91", label: "+91" },
  { value: "+1", label: "+1" },
  { value: "+44", label: "+44" },
];
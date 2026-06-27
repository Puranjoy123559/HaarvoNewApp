"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

import {
  RegisterFormData,
  getEmptyRegisterForm,
} from "@/types/registerTypes";
import { DropdownOption, District, MemberRange } from "@/types/api";
import { mastersApi } from "@/lib/api/mastersApi";
import { authApi } from "@/lib/api/authApi";

// Country codes stay hardcoded — there's no DB master for them.
const COUNTRY_CODES = [
  { value: "+91", label: "+91" },
  { value: "+1", label: "+1" },
  { value: "+44", label: "+44" },
];

// Build a list of years from this year down to 1900.
// new Date().getFullYear() gives the current year automatically — no need
// to update the code each January.
function buildYearOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push(String(year));
  }
  return years;
}

const YEAR_OPTIONS = buildYearOptions();

// Errors keyed by field name.
type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

export default function RegisterForm() {
  const router = useRouter();

  // ===== FORM STATE =====
  const [formData, setFormData] = useState<RegisterFormData>(
    getEmptyRegisterForm(),
  );
  const [errors, setErrors] = useState<FormErrors>({});

  // ===== DROPDOWN DATA LOADED FROM API =====
  const [organisationTypes, setOrganisationTypes] = useState<DropdownOption[]>(
    [],
  );
  const [states, setStates] = useState<DropdownOption[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [crops, setCrops] = useState<DropdownOption[]>([]);
  const [designations, setDesignations] = useState<DropdownOption[]>([]);
  const [languages, setLanguages] = useState<DropdownOption[]>([]);
  const [promotingAgencies, setPromotingAgencies] = useState<DropdownOption[]>(
    [],
  );
  const [memberRanges, setMemberRanges] = useState<MemberRange[]>([]);

  // ===== LOADING / CHECKING STATES =====
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState({
      email: false,
      mobileNumber: false,
      registrationNumber: false,
    });

  // True while we're in the middle of calling the register API.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===== LOAD ALL DROPDOWNS ON FIRST RENDER =====
  // useEffect with [] as deps runs once when the component mounts.
  // Same idea as ngOnInit in Angular or page Load in .NET MVC.
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        // Promise.all runs all calls in parallel — faster than awaiting one at a time.
        const [orgs, sts, crs, dess, langs, agencies, ranges] =
          await Promise.all([
            mastersApi.getOrganisationTypes(),
            mastersApi.getStates(),
            mastersApi.getCrops(),
            mastersApi.getDesignations(),
            mastersApi.getLanguages(),
            mastersApi.getPromotingAgencies(),
            mastersApi.getMemberRanges(),
          ]);

        setOrganisationTypes(orgs);
        setStates(sts);
        setCrops(crs);
        setDesignations(dess);
        setLanguages(langs);
        setPromotingAgencies(agencies);
        setMemberRanges(ranges);

        // Pre-select sensible defaults using the master codes.
        const defaultLanguage = langs.find((l) => l.code === "EN");
        const defaultAgency = agencies.find((a) => a.code === "NONE");

        setFormData((prev) => ({
          ...prev,
          language: defaultLanguage ? String(defaultLanguage.id) : "",
          promotingAgency: defaultAgency ? String(defaultAgency.id) : "",
        }));
      } catch (error) {
        console.error("Failed to load dropdown data", error);
        alert("Could not load form data from the server. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDropdowns();
  }, []);

  // ===== CASCADING: LOAD DISTRICTS WHEN STATE CHANGES =====
  useEffect(() => {
    if (!formData.state) return;

    const stateId = Number(formData.state);
    mastersApi
      .getDistricts(stateId)
      .then(setDistricts)
      .catch((e) => console.error("Failed to load districts", e));
  }, [formData.state]);

  // ===== HELPERS =====

  const updateField = (
    fieldName: keyof RegisterFormData,
    value: string | boolean,
  ) => {
    setFormData({ ...formData, [fieldName]: value });

    // Clear field's error as soon as user edits it.
    if (errors[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  };

const updateStateField = (newStateId: string) => {
    setFormData({
      ...formData,
      state: newStateId,
      district: "",
    });

    // If the user cleared the state, clear the district list too.
    if (!newStateId) {
      setDistricts([]);
    }

    if (errors.state || errors.district) {
      const newErrors = { ...errors };
      delete newErrors.state;
      delete newErrors.district;
      setErrors(newErrors);
    }
  };

  // ===== AVAILABILITY CHECKS (fire onBlur) =====

  const handleEmailBlur = async () => {
    const email = formData.email.trim();
    // Skip API call unless the format is at least valid.
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setIsChecking((prev) => ({ ...prev, email: true }));
    try {
      const result = await authApi.checkEmail(email);
      if (!result.available) {
        setErrors((prev) => ({
          ...prev,
          email: result.message || "This email is already registered",
        }));
      }
    } catch {
      // Silent fail — availability check is non-blocking.
    } finally {
      setIsChecking((prev) => ({ ...prev, email: false }));
    }
  };

  const handleMobileBlur = async () => {
    const mobile = formData.mobileNumber.trim();
    if (!mobile || !/^\d{10}$/.test(mobile)) return;

    setIsChecking((prev) => ({ ...prev, mobileNumber: true }));
    try {
      const result = await authApi.checkMobile(mobile);
      if (!result.available) {
        setErrors((prev) => ({
          ...prev,
          mobileNumber:
            result.message || "This mobile number is already registered",
        }));
      }
    } catch {
      // ignore
    } finally {
      setIsChecking((prev) => ({ ...prev, mobileNumber: false }));
    }
  };

  const handleRegistrationNumberBlur = async () => {
    const regNum = formData.registrationNumber.trim();
    if (!regNum) return;

    setIsChecking((prev) => ({ ...prev, registrationNumber: true }));
    try {
      const result = await authApi.checkRegistrationNumber(regNum);
      if (!result.available) {
        setErrors((prev) => ({
          ...prev,
          registrationNumber:
            result.message ||
            "This registration number is already registered",
        }));
      }
    } catch {
      // ignore
    } finally {
      setIsChecking((prev) => ({ ...prev, registrationNumber: false }));
    }
  };

  // ===== CLIENT-SIDE VALIDATION =====

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.organisationName.trim()) {
      newErrors.organisationName = "Organisation name is required";
    }
    if (!formData.organisationType) {
      newErrors.organisationType = "Please select organisation type";
    }
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }
    if (!formData.state) {
      newErrors.state = "Please select a state";
    }
    if (!formData.district) {
      newErrors.district = "Please select a district";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }

    return newErrors;
  };

  // Track whether we're currently calling the register API so we can disable
  // the button + show a "Submitting..." label.
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Convert the string IDs from the dropdowns into actual numbers
      // before sending to the backend (the DTO expects numbers).
      const payload = {
        organisationName: formData.organisationName.trim(),
        organisationTypeId: Number(formData.organisationType),
        registrationNumber: formData.registrationNumber.trim(),
        yearOfRegistration: formData.yearOfRegistration
          ? Number(formData.yearOfRegistration)
          : undefined,
        stateId: Number(formData.state),
        districtId: Number(formData.district),
        memberRangeId: formData.memberCount
          ? Number(formData.memberCount)
          : undefined,
        primaryCropId: formData.primaryCrop
          ? Number(formData.primaryCrop)
          : undefined,
        promotingAgencyId: formData.promotingAgency
          ? Number(formData.promotingAgency)
          : undefined,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        countryCode: formData.countryCode,
        mobileNumber: formData.mobileNumber.trim(),
        designationId: formData.designation
          ? Number(formData.designation)
          : undefined,
        languageId: Number(formData.language),
        agreedToTerms: formData.agreedToTerms,
      };

      const response = await authApi.registerOrganisation(payload);

      // Navigate to the OTP screen with the token + masked email + expiry
      // passed as URL query parameters.
      const params = new URLSearchParams({
        token: response.otpToken,
        email: response.maskedEmail,
        expires: String(response.expiresInSeconds),
      });
      router.push(`/verify-otp?${params.toString()}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      alert(`Registration failed: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== STYLE HELPERS =====

  const inputClass = (hasError: boolean) => {
    const base =
      "w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition";
    return hasError
      ? `${base} border-red-400 focus:ring-red-300`
      : `${base} border-gray-300 focus:ring-[#0E3D2E] focus:border-transparent`;
  };

  const selectClass = (hasError: boolean) => {
    const base =
      "w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 transition disabled:bg-gray-100 disabled:text-gray-500";
    return hasError
      ? `${base} border-red-400 focus:ring-red-300`
      : `${base} border-gray-300 focus:ring-[#0E3D2E]`;
  };


  // ===== RENDER =====

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-[#023530] px-6 sm:px-10 py-6 sm:py-8 text-center">
        <div className="flex justify-center">
          <Logo className="h-14" href="/" />
        </div>
        <p className="text-[#C9E5D2] text-xs sm:text-sm mt-2">
          Enabling trade-ready agricultural supply
        </p>
      </div>

      <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center">
          Register your organisation
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm text-center mt-2">
          Takes 3 minutes. Your Haarvo ops team can help you fill this.
        </p>

        {/* Progress bar */}
        <div className="mt-6 flex gap-2">
          <div className="h-1.5 flex-1 bg-[#0E3D2E] rounded-full"></div>
          <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
          <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Step 1 of 3 — Organisation details
        </p>

        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-3 text-sm mt-6 text-center">
            Loading form data from server...
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8" noValidate>
          {/* SECTION: Organisation Identity */}
          <div>
            <h3 className="text-sm font-semibold text-[#0E3D2E] uppercase tracking-wider border-b border-gray-200 pb-2 mb-5">
              Organisation Identity
            </h3>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Organisation name <RequiredBadge />
              </label>
              <input
                type="text"
                value={formData.organisationName}
                onChange={(e) => updateField("organisationName", e.target.value)}
                placeholder="e.g. Karbi Ginger Growers FPC Ltd."
                className={inputClass(!!errors.organisationName)}
              />
              <ErrorText message={errors.organisationName} />
              {!errors.organisationName && (
                <p className="text-xs text-gray-500 mt-1">
                  Full legal name as registered with MCA / state registrar
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Organisation type <RequiredBadge />
              </label>
              <select
                value={formData.organisationType}
                onChange={(e) => updateField("organisationType", e.target.value)}
                className={selectClass(!!errors.organisationType)}
                disabled={isLoading}
              >
                <option value="">Select type</option>
                {organisationTypes.map((option) => (
                  <option key={option.id} value={String(option.id)}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ErrorText message={errors.organisationType} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  Registration number <RequiredBadge />
                </label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    updateField("registrationNumber", e.target.value)
                  }
                  onBlur={handleRegistrationNumberBlur}
                  placeholder="CIN / Society No."
                  className={inputClass(!!errors.registrationNumber)}
                />
                <ErrorText message={errors.registrationNumber} />
                <CheckingText visible={isChecking.registrationNumber} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  Year of registration
                </label>
                <select
                  value={formData.yearOfRegistration}
                  onChange={(e) =>
                    updateField("yearOfRegistration", e.target.value)
                  }
                  className={selectClass(false)}
                >
                  <option value="">Select year</option>
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  State <RequiredBadge />
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => updateStateField(e.target.value)}
                  className={selectClass(!!errors.state)}
                  disabled={isLoading}
                >
                  <option value="">Select state</option>
                  {states.map((option) => (
                    <option key={option.id} value={String(option.id)}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <ErrorText message={errors.state} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  District <RequiredBadge />
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => updateField("district", e.target.value)}
                  className={selectClass(!!errors.district)}
                  disabled={!formData.state}
                >
                  <option value="">
                    {formData.state ? "Select district" : "Select state first"}
                  </option>
                  {districts.map((option) => (
                    <option key={option.id} value={String(option.id)}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <ErrorText message={errors.district} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  Number of active members
                </label>
                <select
                  value={formData.memberCount}
                  onChange={(e) => updateField("memberCount", e.target.value)}
                  className={selectClass(false)}
                  disabled={isLoading}
                >
                  <option value="">Select range</option>
                  {memberRanges.map((option) => (
                    <option key={option.id} value={String(option.id)}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  Primary crop
                </label>
                <select
                  value={formData.primaryCrop}
                  onChange={(e) => updateField("primaryCrop", e.target.value)}
                  className={selectClass(false)}
                  disabled={isLoading}
                >
                  <option value="">Select primary crop</option>
                  {crops.map((option) => (
                    <option key={option.id} value={String(option.id)}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION: Primary Manager / CEO */}
          <div>
            <h3 className="text-sm font-semibold text-[#0E3D2E] uppercase tracking-wider border-b border-gray-200 pb-2 mb-5">
              Primary Manager / CEO
            </h3>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Full name <RequiredBadge />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="First name"
                    className={inputClass(!!errors.firstName)}
                  />
                  <ErrorText message={errors.firstName} />
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Last name"
                    className={inputClass(!!errors.lastName)}
                  />
                  <ErrorText message={errors.lastName} />
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Designation
              </label>
              <select
                value={formData.designation}
                onChange={(e) => updateField("designation", e.target.value)}
                className={selectClass(false)}
                disabled={isLoading}
              >
                <option value="">Select designation</option>
                {designations.map((option) => (
                  <option key={option.id} value={String(option.id)}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Mobile number <RequiredBadge />
              </label>
              <div className="flex gap-2 sm:gap-3">
                <select
                  value={formData.countryCode}
                  onChange={(e) => updateField("countryCode", e.target.value)}
                  className="w-20 sm:w-24 px-2 sm:px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0E3D2E]"
                >
                  {COUNTRY_CODES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex-1">
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      updateField("mobileNumber", e.target.value)
                    }
                    onBlur={handleMobileBlur}
                    placeholder="9XXXXXXXXX"
                    className={inputClass(!!errors.mobileNumber)}
                  />
                </div>
              </div>
              <ErrorText message={errors.mobileNumber} />
              <CheckingText visible={isChecking.mobileNumber} />
              {!errors.mobileNumber && !isChecking.mobileNumber && (
                <p className="text-xs text-gray-500 mt-1">
                  This will be your login. An OTP will be sent to verify.
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Email address <RequiredBadge />
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="you@organisation.com"
                className={inputClass(!!errors.email)}
              />
              <ErrorText message={errors.email} />
              <CheckingText visible={isChecking.email} />
              {!errors.email && !isChecking.email && (
                <p className="text-xs text-gray-500 mt-1">
                  We will send a one-time password (OTP) to this email.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Preferred language
              </label>
              <select
                value={formData.language}
                onChange={(e) => updateField("language", e.target.value)}
                className={selectClass(false)}
                disabled={isLoading}
              >
                {languages.map((option) => (
                  <option key={option.id} value={String(option.id)}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION: Promoting Agency */}
          <div>
            <h3 className="text-sm font-semibold text-[#0E3D2E] uppercase tracking-wider border-b border-gray-200 pb-2 mb-5">
              Promoting Agency{" "}
              <span className="text-gray-400 normal-case font-normal text-xs">
                (optional – skip if unsure)
              </span>
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Promoted / supported by
              </label>
              <select
                value={formData.promotingAgency}
                onChange={(e) => updateField("promotingAgency", e.target.value)}
                className={selectClass(false)}
                disabled={isLoading}
              >
                {promotingAgencies.map((option) => (
                  <option key={option.id} value={String(option.id)}>
                    {option.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#B26B00] mt-1">
                If referred by NABARD or ARIAS, select here — it helps us assign
                your account manager faster.
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-[#F2F8F4] border border-[#CDE5D5] rounded-lg p-4 flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => updateField("agreedToTerms", e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#0E3D2E] flex-shrink-0"
            />
            <p className="text-sm text-gray-700">
              I confirm that I am authorised to register this organisation on
              Haarvo, and I agree to the{" "}
              <a href="#" className="underline text-[#0E3D2E] font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline text-[#0E3D2E] font-medium">
                Privacy Policy
              </a>
              .
            </p>
          </div>

        <button
            type="submit"
            disabled={!formData.agreedToTerms || isLoading || isSubmitting}
            className="w-full bg-[#0E3D2E] text-white py-3.5 rounded-lg font-semibold text-base hover:bg-[#0A2E22] active:scale-[0.99] transition disabled:bg-gray-300 disabled:cursor-not-allowed">
            {isSubmitting ? "Sending OTP..." : "Register and send OTP →"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-[#0E3D2E] font-semibold underline"
            >
              Log in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function RequiredBadge() {
  return (
    <span className="ml-1 inline-block bg-[#FDE7E7] text-[#C03A3A] text-[10px] font-semibold px-2 py-0.5 rounded-full align-middle">
      Required
    </span>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-600 mt-1">{message}</p>;
}

function CheckingText({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return <p className="text-xs text-gray-500 mt-1">Checking availability...</p>;
}
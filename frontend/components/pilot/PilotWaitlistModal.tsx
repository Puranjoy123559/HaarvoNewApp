"use client";

import { useState, useEffect } from "react";
import { DropdownOption, District } from "@/types/api";
import {
  PilotFormData,
  getEmptyPilotForm,
} from "@/types/pilotTypes";
import { mastersApi } from "@/lib/api/mastersApi";
import { pilotApi } from "@/lib/api/pilotApi";

// Country codes stay hardcoded — there's no DB master for them.
const COUNTRY_CODES = [
  { value: "+91", label: "+91" },
  { value: "+1", label: "+1" },
  { value: "+44", label: "+44" },
];

// Errors keyed by field name.
type FormErrors = Partial<Record<keyof PilotFormData, string>>;

// Props: the parent tells us when to show (isOpen) and gives us a way to
// close ourselves (onClose).
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PilotWaitlistModal({ isOpen, onClose }: Props) {
  // ===== FORM STATE =====
  const [formData, setFormData] = useState<PilotFormData>(getEmptyPilotForm());
  const [errors, setErrors] = useState<FormErrors>({});

  // ===== DROPDOWN DATA FROM API =====
  const [states, setStates] = useState<DropdownOption[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [crops, setCrops] = useState<DropdownOption[]>([]);

  // ===== UI FLAGS =====
  const [isLoading, setIsLoading] = useState(true); // loading dropdowns
  const [isSubmitting, setIsSubmitting] = useState(false); // calling the API
  const [successMessage, setSuccessMessage] = useState(""); // set after save

  // ===== LOAD STATES + CROPS WHEN THE MODAL OPENS =====
  useEffect(() => {
    // Only load when the modal is actually open.
    if (!isOpen) return;

    const loadDropdowns = async () => {
      // FIX: Moved state resets inside the async function to prevent synchronous cascading renders.
      setFormData(getEmptyPilotForm());
      setErrors({});
      setSuccessMessage("");
      setDistricts([]);
      setIsLoading(true);

      try {
        // Promise.all runs both calls in parallel.
        const [sts, crs] = await Promise.all([
          mastersApi.getStates(),
          mastersApi.getCrops(),
        ]);
        setStates(sts);
        setCrops(crs);
      } catch (error) {
        console.error("Failed to load dropdown data", error);
        alert("Could not load form data from the server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDropdowns();
  }, [isOpen]);

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

  const updateField = (fieldName: keyof PilotFormData, value: string) => {
    setFormData({ ...formData, [fieldName]: value });

    // Clear this field's error as soon as the user edits it.
    if (errors[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  };

  // When the state changes we also reset the district (it depends on state).
  const updateStateField = (newStateId: string) => {
    setFormData({ ...formData, state: newStateId, district: "" });

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

  // ===== VALIDATION =====
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }
    if (!formData.organisationName.trim()) {
      newErrors.organisationName = "Organisation name is required";
    }
    if (!formData.state) {
      newErrors.state = "Please select a state";
    }
    if (!formData.district) {
      newErrors.district = "Please select a district";
    }
    // Primary crop is optional — no check needed.

    return newErrors;
  };

  // ===== SUBMIT =====
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
      // Convert the id strings into numbers before sending.
      const payload = {
        fullName: formData.fullName.trim(),
        countryCode: formData.countryCode,
        mobileNumber: formData.mobileNumber.trim(),
        organisationName: formData.organisationName.trim(),
        stateId: Number(formData.state),
        districtId: Number(formData.district),
        primaryCropId: formData.primaryCrop
          ? Number(formData.primaryCrop)
          : undefined,
      };

      const response = await pilotApi.joinWaitlist(payload);

      // Show the success message; the form is replaced by a thank-you panel.
      setSuccessMessage(response.message);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      // If the backend said the mobile is a duplicate, show it on that field.
      if (message.toLowerCase().includes("mobile")) {
        setErrors((prev) => ({ ...prev, mobileNumber: message }));
      } else {
        alert(`Could not submit: ${message}`);
      }
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

  // If the modal is closed, render nothing.
  if (!isOpen) return null;

  // ===== RENDER =====
  return (
    // Dark backdrop. Clicking it closes the modal.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      {/* The white card. stopPropagation = clicking inside does NOT close. */}
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        {successMessage ? (
          // ===== SUCCESS VIEW =====
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-[#0E3D2E] mb-3">
              You&apos;re on the list 🎉
            </h2>
            <p className="text-gray-600 text-sm mb-8">{successMessage}</p>
            <button
              onClick={onClose}
              className="bg-[#0E3D2E] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0A2E22] transition"
            >
              Done
            </button>
          </div>
        ) : (
          // ===== FORM VIEW =====
          <>
            <h2 className="text-2xl font-bold text-[#0E3D2E]">
              Join the Haarvo Waitlist
            </h2>
            <p className="text-gray-600 text-sm mt-2 mb-6">
              We&apos;re onboarding a limited group of farmer collectives into
              our Phase 1 network. Share your details and our team will reach
              out.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Full name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className={inputClass(!!errors.fullName)}
                />
                <ErrorText message={errors.fullName} />
              </div>

              {/* Mobile + Organisation name (two columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Mobile number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) =>
                        updateField("countryCode", e.target.value)
                      }
                      className="w-20 px-2 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0E3D2E]"
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
                        placeholder="00000 00000"
                        className={inputClass(!!errors.mobileNumber)}
                      />
                    </div>
                  </div>
                  <ErrorText message={errors.mobileNumber} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    FPO / Organisation name
                  </label>
                  <input
                    type="text"
                    value={formData.organisationName}
                    onChange={(e) =>
                      updateField("organisationName", e.target.value)
                    }
                    placeholder="Collective name"
                    className={inputClass(!!errors.organisationName)}
                  />
                  <ErrorText message={errors.organisationName} />
                </div>
              </div>

              {/* State + District (cascading) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    State
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
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    District
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => updateField("district", e.target.value)}
                    className={selectClass(!!errors.district)}
                    disabled={!formData.state}
                  >
                    <option value="">
                      {formData.state
                        ? "Select district"
                        : "Select state first"}
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

              {/* Primary crop (optional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Primary crop / commodity{" "}
                  <span className="text-gray-400 normal-case font-normal">
                    (optional)
                  </span>
                </label>
                <select
                  value={formData.primaryCrop}
                  onChange={(e) => updateField("primaryCrop", e.target.value)}
                  className={selectClass(false)}
                  disabled={isLoading}
                >
                  <option value="">Select primary commodity</option>
                  {crops.map((option) => (
                    <option key={option.id} value={String(option.id)}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className="w-full bg-[#0E3D2E] text-white py-3 rounded-full font-semibold text-sm hover:bg-[#0A2E22] active:scale-[0.99] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Request Early Access →"}
              </button>

              <p className="text-xs text-gray-500 border-t border-gray-200 pt-4">
                Selected FPOs will be prioritised based on operational readiness
                and cluster fit. Our onboarding team typically responds within
                48 hours.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// Small helper component to show a red error message under a field.
function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-600 mt-1">{message}</p>;
}
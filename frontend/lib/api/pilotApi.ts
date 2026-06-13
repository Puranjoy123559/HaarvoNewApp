import { apiPost } from "./apiClient";
import { PilotWaitlistRequest, PilotWaitlistResponse } from "@/types/pilotTypes";

export const pilotApi = {
  joinWaitlist: (data: PilotWaitlistRequest) =>
    apiPost<PilotWaitlistResponse, PilotWaitlistRequest>(
      "/pilot/waitlist",
      data,
    ),
};
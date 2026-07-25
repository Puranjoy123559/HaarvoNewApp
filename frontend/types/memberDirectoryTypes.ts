// The three possible member states
export type MemberStatus = "Verified" | "Pending" | "Inactive";

// One row in the members table
export interface DirectoryMember {
  id: number;              // internal id (auto-increment in the DB later)
  memberId: string;        // the display id, e.g. "HT-10234"
  farmerName: string;
  village: string;
  primaryCommodity: string;
  phoneNumber: string;
  status: MemberStatus;
}

// One summary card at the top
export interface DirectoryStat {
  id: string;
  label: string;
  value: string;
  hint: string;
  hintTone: "positive" | "neutral";
  icon: string;
}

// Everything the screen needs in one object
export interface MemberDirectoryData {
  stats: DirectoryStat[];
  members: DirectoryMember[];
}
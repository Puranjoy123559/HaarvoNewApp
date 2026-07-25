import { MemberDirectoryData } from "@/types/memberDirectoryTypes";
// import { apiGet } from "./apiClient"; // <-- uncomment when the real API is ready

// PLACEHOLDER DATA (stands in for the database).
// When the backend "/members" endpoint is ready: uncomment the import above,
// use the real call in getMembers(), and delete this object. The screen keeps
// working because the shape stays the same — the dummy rows just disappear.
const placeholderDirectory: MemberDirectoryData = {
  stats: [
    { id: "total",    label: "TOTAL MEMBERS",     value: "2,450", hint: "+2.4% from last month", hintTone: "positive", icon: "trend" },
    { id: "verified", label: "VERIFIED",          value: "1,980", hint: "81% Compliance",        hintTone: "neutral",  icon: "verified" },
    { id: "active",   label: "ACTIVE",            value: "2,120", hint: "86% Engagement",        hintTone: "neutral",  icon: "active" },
    { id: "new",      label: "NEW REGISTRATIONS", value: "45",    hint: "This Week",             hintTone: "neutral",  icon: "new" },
  ],
  members: [
    { id: 1,  memberId: "HT-10234", farmerName: "Rajesh Patel",   village: "Rajula", primaryCommodity: "Cumin",  phoneNumber: "+91 9843044779", status: "Verified" },
    { id: 2,  memberId: "HT-10235", farmerName: "Sanjay Mehta",   village: "Lathi",  primaryCommodity: "Cotton", phoneNumber: "+91 9820361678", status: "Pending" },
    { id: 3,  memberId: "HT-10236", farmerName: "Anita Desai",    village: "Dhari",  primaryCommodity: "Wheat",  phoneNumber: "+91 9881883283", status: "Inactive" },
    { id: 4,  memberId: "HT-10237", farmerName: "Vikram Shah",    village: "Rajula", primaryCommodity: "Cotton", phoneNumber: "+91 9821834816", status: "Verified" },
    { id: 5,  memberId: "HT-10238", farmerName: "Priya Kulkarni", village: "Dhari",  primaryCommodity: "Castor", phoneNumber: "+91 9857561695", status: "Pending" },
    { id: 6,  memberId: "HT-10239", farmerName: "Amit Gadhvi",    village: "Babra",  primaryCommodity: "Cumin",  phoneNumber: "+91 9841359142", status: "Inactive" },
    { id: 7,  memberId: "HT-10240", farmerName: "Rahul Verma",    village: "Dhari",  primaryCommodity: "Cotton", phoneNumber: "+91 9827602086", status: "Verified" },
    { id: 8,  memberId: "HT-10241", farmerName: "Deepak Joshi",   village: "Dhari",  primaryCommodity: "Wheat",  phoneNumber: "+91 9827160051", status: "Pending" },
    { id: 9,  memberId: "HT-10242", farmerName: "Sunil Thakkar",  village: "Lathi",  primaryCommodity: "Cotton", phoneNumber: "+91 9835745362", status: "Inactive" },
    { id: 10, memberId: "HT-10243", farmerName: "Manoj Parmar",   village: "Amreli", primaryCommodity: "Cotton", phoneNumber: "+91 9863747500", status: "Verified" },
    { id: 11, memberId: "HT-10244", farmerName: "Gita Ben",       village: "Dhari",  primaryCommodity: "Castor", phoneNumber: "+91 9864067896", status: "Pending" },
    { id: 12, memberId: "HT-10245", farmerName: "Arvind Mori",    village: "Dhari",  primaryCommodity: "Wheat",  phoneNumber: "+91 9883561132", status: "Inactive" },
    { id: 13, memberId: "HT-10246", farmerName: "Kavit Jani",     village: "Babra",  primaryCommodity: "Castor", phoneNumber: "+91 9817779122", status: "Verified" },
    { id: 14, memberId: "HT-10247", farmerName: "Sonal Patel",    village: "Rajula", primaryCommodity: "Castor", phoneNumber: "+91 9876898365", status: "Pending" },
    { id: 15, memberId: "HT-10248", farmerName: "Prakash Solanki",village: "Lathi",  primaryCommodity: "Castor", phoneNumber: "+91 9854427952", status: "Inactive" },
    { id: 16, memberId: "HT-10249", farmerName: "Nilesh Chauhan", village: "Amreli", primaryCommodity: "Cumin",  phoneNumber: "+91 9812345678", status: "Verified" },
    { id: 17, memberId: "HT-10250", farmerName: "Bhavna Rana",    village: "Rajula", primaryCommodity: "Wheat",  phoneNumber: "+91 9898765432", status: "Pending" },
    { id: 18, memberId: "HT-10251", farmerName: "Kiran Bhatt",    village: "Lathi",  primaryCommodity: "Cotton", phoneNumber: "+91 9845098234", status: "Verified" },
    { id: 19, memberId: "HT-10252", farmerName: "Hardik Vyas",    village: "Dhari",  primaryCommodity: "Cumin",  phoneNumber: "+91 9833012876", status: "Inactive" },
    { id: 20, memberId: "HT-10253", farmerName: "Meena Trivedi",  village: "Babra",  primaryCommodity: "Wheat",  phoneNumber: "+91 9822456701", status: "Verified" },
    { id: 21, memberId: "HT-10254", farmerName: "Jayesh Dave",    village: "Amreli", primaryCommodity: "Cotton", phoneNumber: "+91 9811223344", status: "Pending" },
    { id: 22, memberId: "HT-10255", farmerName: "Rekha Pandya",   village: "Rajula", primaryCommodity: "Castor", phoneNumber: "+91 9877665544", status: "Verified" },
    { id: 23, memberId: "HT-10256", farmerName: "Dinesh Barot",   village: "Lathi",  primaryCommodity: "Cumin",  phoneNumber: "+91 9866554433", status: "Inactive" },
    { id: 24, memberId: "HT-10257", farmerName: "Sneha Modi",     village: "Dhari",  primaryCommodity: "Cotton", phoneNumber: "+91 9855443322", status: "Verified" },
    { id: 25, memberId: "HT-10258", farmerName: "Paresh Gohil",   village: "Babra",  primaryCommodity: "Castor", phoneNumber: "+91 9844332211", status: "Pending" },
    { id: 26, memberId: "HT-10259", farmerName: "Falguni Shah",   village: "Amreli", primaryCommodity: "Wheat",  phoneNumber: "+91 9833221100", status: "Verified" },
    { id: 27, memberId: "HT-10260", farmerName: "Mahesh Rathod",  village: "Rajula", primaryCommodity: "Cotton", phoneNumber: "+91 9822110099", status: "Inactive" },
    { id: 28, memberId: "HT-10261", farmerName: "Krishna Vaghela",village: "Lathi",  primaryCommodity: "Cumin",  phoneNumber: "+91 9811009988", status: "Verified" },
    { id: 29, memberId: "HT-10262", farmerName: "Bhargav Nair",   village: "Dhari",  primaryCommodity: "Cotton", phoneNumber: "+91 9800998877", status: "Pending" },
    { id: 30, memberId: "HT-10263", farmerName: "Divya Iyer",     village: "Babra",  primaryCommodity: "Castor", phoneNumber: "+91 9899887766", status: "Verified" },
    { id: 31, memberId: "HT-10264", farmerName: "Suresh Zala",    village: "Amreli", primaryCommodity: "Wheat",  phoneNumber: "+91 9888776655", status: "Inactive" },
    { id: 32, memberId: "HT-10265", farmerName: "Naina Purohit",  village: "Rajula", primaryCommodity: "Cotton", phoneNumber: "+91 9877665500", status: "Verified" },
  ],
};

export const memberDirectoryApi = {
  getMembers: async (): Promise<MemberDirectoryData> => {
    // return apiGet<MemberDirectoryData>("/members"); // <-- the real call, later
    return Promise.resolve(placeholderDirectory);
  },
};
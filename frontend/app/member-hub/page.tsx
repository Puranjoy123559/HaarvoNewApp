"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone } from "lucide-react";
import { authApi } from "@/lib/api/authApi";
import { memberHubApi } from "@/lib/api/memberHubApi";
import { useToast } from "@/components/ui/Toast";
import { UserInfo } from "@/types/api";
import { MemberHubData } from "@/types/memberHubTypes";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import ConversationList from "@/components/member/ConversationList";
import ChatThread from "@/components/member/ChatThread";

export default function MemberHubPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [data, setData] = useState<MemberHubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then(async (info) => {
        setUser(info);
        const memberHub = await memberHubApi.getMemberHub();
        setData(memberHub);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      router.replace("/login");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F5F4F1] text-gray-600">
        Loading...
      </main>
    );
  }

  if (!user || !data) {
    return null;
  }

  // Find the conversation whose chat is currently open (fallback to the first)
  const activeConversation =
    data.conversations.find((c) => c.id === data.activeConversationId) ??
    data.conversations[0];

  return (
    <main className="min-h-screen bg-[#F5F4F1]">
      <DashboardNavbar user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title + Create Broadcast */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#0E3D2E]">M-Konnect</h2>
            <p className="mt-1 text-gray-600">
              Communicate with farmers, field teams and management from one unified inbox.
            </p>
          </div>
          <button
            onClick={() => showToast("Create Broadcast is coming soon — implementation pending.")}
            className="flex items-center gap-2 rounded-md bg-[#0E3D2E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A2E22] active:scale-95 transition"
          >
            <Megaphone size={16} /> Create Broadcast
          </button>
        </div>

        {/* Two-pane chat card */}
        <div className="mt-6 flex flex-col lg:flex-row overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 lg:h-[640px]">
          {/* Left: conversation list */}
          <div className="lg:w-1/3 border-b border-gray-100 lg:border-b-0 lg:border-r h-[420px] lg:h-full">
            <ConversationList
              conversations={data.conversations}
              activeId={data.activeConversationId}
            />
          </div>

          {/* Right: chat thread */}
          <div className="lg:flex-1 h-[560px] lg:h-full">
            <ChatThread
              conversation={activeConversation}
              messages={data.messages}
              dayLabel={data.dayLabel}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
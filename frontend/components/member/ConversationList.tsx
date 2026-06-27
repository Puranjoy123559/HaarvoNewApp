"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Conversation } from "@/types/memberHubTypes";

// tag tone -> colour classes
const tagClass = {
  plain: "bg-gray-100 text-gray-600",
  green: "bg-[#E6F4EA] text-[#0E3D2E]",
  amber: "bg-amber-100 text-amber-700",
};

interface Props {
  conversations: Conversation[];
  activeId: number;
}

export default function ConversationList({ conversations, activeId }: Props) {
  const { showToast } = useToast();
  const pending = (label: string) =>
    showToast(`${label} is coming soon — implementation pending.`);

  const [activeTab, setActiveTab] = useState("all");
  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "requests", label: "Requests" },
    { id: "broadcasts", label: "Broadcasts" },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Search + tabs */}
      <div className="p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            onFocus={() => pending("Search")}
            className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-[#0E3D2E] focus:outline-none"
          />
        </div>

        <div className="mt-3 flex gap-4 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== "all") pending(tab.label);
              }}
              className={`pb-1 ${
                activeTab === tab.id
                  ? "border-b-2 border-[#0E3D2E] font-semibold text-[#0E3D2E]"
                  : "text-gray-500 hover:text-[#0E3D2E]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation rows (scrolls if long) */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => pending(`Opening chat with ${c.name}`)}
              className={`flex w-full gap-3 border-l-2 px-4 py-3 text-left transition ${
                isActive
                  ? "border-[#0E3D2E] bg-gray-50"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              {/* Avatar + online dot */}
              <span className="relative flex-shrink-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0E3D2E] font-semibold text-white">
                  {c.name.charAt(0)}
                </span>
                {c.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#7FD09A]" />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{c.name}</span>
                  <span className="text-xs text-gray-400">{c.time}</span>
                </span>

                {/* Tags */}
                <span className="mt-1 flex flex-wrap gap-1">
                  {c.tags.map((t, i) => (
                    <span
                      key={i}
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold ${tagClass[t.tone]}`}
                    >
                      {t.label}
                    </span>
                  ))}
                </span>

                {/* Preview + unread badge */}
                <span className="mt-1 flex items-center justify-between gap-2">
                  <span className="truncate text-sm text-gray-600">{c.preview}</span>
                  {c.unreadCount > 0 && (
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0E3D2E] text-[10px] font-semibold text-white">
                      {c.unreadCount}
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
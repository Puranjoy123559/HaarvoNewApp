"use client";

import Image from "next/image"; // 1. Import Next.js Image component
import { MoreVertical, Smile, Paperclip, Mic, Send, CheckCheck } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Conversation, ChatMessage } from "@/types/memberHubTypes";

interface Props {
  conversation: Conversation;
  messages: ChatMessage[];
  dayLabel: string;
}

export default function ChatThread({ conversation, messages, dayLabel }: Props) {
  const { showToast } = useToast();
  const pending = (label: string) =>
    showToast(`${label} is coming soon — implementation pending.`);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0E3D2E] font-semibold text-white">
            {conversation.name.charAt(0)}
          </span>
          <div>
            <p className="flex items-center gap-2 font-semibold text-gray-800">
              {conversation.name}
              {conversation.isOnline && (
                <span className="text-xs font-medium text-[#7FD09A]">• Online</span>
              )}
            </p>
            <p className="text-xs text-gray-500">{conversation.detail}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => pending("View Profile")}
            className="text-sm font-medium text-[#0E3D2E] hover:underline"
          >
            View Profile
          </button>
          <button
            onClick={() => pending("More options")}
            className="text-gray-400 hover:text-gray-600"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages (scrolls) */}
      <div className="flex-1 min-h-0 space-y-4 overflow-y-auto bg-[#FAFAF8] px-5 py-4">
        {/* Day divider */}
        <div className="flex justify-center">
          <span className="rounded-full bg-gray-200 px-3 py-0.5 text-xs font-medium text-gray-600">
            {dayLabel}
          </span>
        </div>

        {messages.map((m) => {
          const isOutgoing = m.direction === "outgoing";
          return (
            <div key={m.id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
              <div className="max-w-md">
                <div
                  className={`rounded-lg px-4 py-2 text-sm ${
                    isOutgoing
                      ? "bg-[#0E3D2E] text-white"
                      : "bg-white text-gray-800 ring-1 ring-gray-100"
                  }`}
                >
                  {/* optional image; if the file is missing it hides itself */}
                  {m.imageUrl && (
                    <div className="relative mb-2 h-48 w-64 max-w-full overflow-hidden rounded-md">
                      <Image
                        src={m.imageUrl}
                        alt="Shared attachment"
                        fill
                        unoptimized // Recommended for arbitrary chat attachments to avoid hosting optimization costs
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="object-cover"
                      />
                    </div>
                  )}
                  {m.text}
                </div>
                <div
                  className={`mt-1 flex items-center gap-1 text-[11px] text-gray-400 ${
                    isOutgoing ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.time}
                  {isOutgoing && m.isRead && <CheckCheck size={13} className="text-[#0E3D2E]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-3">
        <button onClick={() => pending("Emoji")} className="text-gray-400 hover:text-gray-600">
          <Smile size={20} />
        </button>
        <button onClick={() => pending("Attach file")} className="text-gray-400 hover:text-gray-600">
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          onFocus={() => pending("Send message")}
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-[#0E3D2E] focus:outline-none"
        />
        <button onClick={() => pending("Voice message")} className="text-gray-400 hover:text-gray-600">
          <Mic size={20} />
        </button>
        <button
          onClick={() => pending("Send message")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0E3D2E] text-white hover:bg-[#0A2E22] transition"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
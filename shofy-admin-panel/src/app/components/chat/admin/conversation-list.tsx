"use client";
import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { conversations } from "./mock-data";
import { Search } from "lucide-react";

// Initialize dayjs plugins
dayjs.extend(relativeTime);

interface ConversationListProps {
  activeConversation: number | null;
  setActiveConversation: (id: number) => void;
}

const ConversationList = ({ activeConversation, setActiveConversation }: ConversationListProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header with search */}
      <div className="p-4 border-b border-gray">
        <h3 className="text-lg font-medium mb-3">Conversations</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="input h-10 w-full pr-[45px] text-sm"
          />
          <button className="absolute top-1/2 right-4 transform -translate-y-1/2 text-text3 hover:text-theme">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-gray">
        <button className="flex-1 py-2 px-4 text-sm font-medium text-center border-b-2 border-theme">
          All
        </button>
        <button className="flex-1 py-2 px-4 text-sm font-medium text-center text-text3 hover:text-theme">
          Unread
        </button>
        <button className="flex-1 py-2 px-4 text-sm font-medium text-center text-text3 hover:text-theme">
          Resolved
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const otherParticipant = conversation.participants.find(
            (p) => p.role !== "admin"
          )!;
          const lastMessage = conversation.lastMessage;
          
          return (
            <div
              key={conversation.id}
            className={`p-4 border-b border-gray cursor-pointer transition-all hover:bg-gray5 hover:shadow-sm ${
                activeConversation === conversation.id ? "bg-gray5 ring-2 ring-theme/10" : ""
              }`}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <div className="flex items-start gap-3">
                {/* Avatar with status */}
                <div className="relative">
                  <Image
                    src={otherParticipant.avatar}
                    alt={otherParticipant.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      otherParticipant.status === "online"
                        ? "bg-success"
                        : otherParticipant.status === "away"
                        ? "bg-warning"
                        : "bg-gray"
                    }`}
                  ></span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium text-base truncate">
                      {otherParticipant.name}
                    </h4>
                    <span className="text-tiny text-text3">
                      {lastMessage && dayjs(lastMessage.timestamp).fromNow(true)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-text3 truncate max-w-[180px]">
                      {lastMessage?.text}
                    </p>
                    
                    {conversation.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center bg-theme text-white text-xs rounded-full h-5 min-w-[20px] px-1">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  {conversation.isTyping && (
                    <div className="flex items-center mt-1 text-xs text-theme">
                      <span className="mr-1">Typing</span>
                      <span className="typing-animation">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {conversation.tags && conversation.tags.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {conversation.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-tiny px-2 py-0.5 rounded bg-gray5 text-text3"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;

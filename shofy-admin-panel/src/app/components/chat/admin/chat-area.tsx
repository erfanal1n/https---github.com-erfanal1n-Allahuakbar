"use client";
import React, { useState } from "react";
import ConversationList from "./conversation-list";
import ChatWindow from "./chat-window";
import CustomerContext from "./customer-context";

const ChatArea = () => {
  const [activeConversation, setActiveConversation] = useState<number | null>(1);

  return (
    <div className="bg-white rounded-md min-h-[calc(100vh-200px)] w-full">
      <div className="grid grid-cols-12 h-full">
        {/* Conversation List - 3 columns on large screens, full width on small */}
        <div className="col-span-12 md:col-span-3 border-r border-gray">
          <ConversationList 
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
          />
        </div>

        {/* Chat Window - 6 columns on large screens, full width on small */}
        <div className="col-span-12 md:col-span-6 border-r border-gray h-full">
          <ChatWindow activeConversation={activeConversation} />
        </div>

        {/* Customer Context - 3 columns on large screens, hidden on small */}
        <div className="hidden md:block md:col-span-3">
          <CustomerContext activeConversation={activeConversation} />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;

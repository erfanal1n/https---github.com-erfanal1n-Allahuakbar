"use client";
import React from "react";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import Wrapper from "@/layout/wrapper";
import ChatArea from "@/app/components/chat/admin/chat-area";

const LiveChatPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8">
        <div className="flex justify-between mb-10">
          <div className="page-title">
            <h3 className="mb-0 text-[28px] font-medium">Live Chat</h3>
            <ul className="text-tiny font-medium flex items-center space-x-3 text-text3">
              <li className="breadcrumb-item text-muted">
                <Breadcrumb
                  breadcrumbItems={[
                    { label: "Home", path: "/dashboard" },
                    { label: "Live Chat", path: "/live-chat" },
                  ]}
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Chat interface */}
        <ChatArea />
      </div>
    </Wrapper>
  );
};

export default LiveChatPage;

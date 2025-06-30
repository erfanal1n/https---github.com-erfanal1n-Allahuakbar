"use client";
import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { IMessage, IUser } from "./mock-data";
import { File, Download, Play, Check } from "lucide-react";

interface ChatMessageProps {
  message: IMessage;
  sender: IUser;
  isAdmin: boolean;
}

const ChatMessage = ({ message, sender, isAdmin }: ChatMessageProps) => {
  const messageTime = dayjs(message.timestamp).format("h:mm A");

  // Render attachments
  const renderAttachment = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    const attachment = message.attachments[0];

    switch (attachment.type) {
      case "image":
        return (
          <div className="mt-2 rounded-lg overflow-hidden border border-gray">
            <div className="relative w-full h-48">
              <Image
                src={attachment.url}
                alt={attachment.name || "Image"}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            {attachment.name && (
              <div className="p-2 bg-gray5 text-xs flex justify-between">
                <span className="truncate max-w-[200px]">{attachment.name}</span>
                {attachment.size && <span>{attachment.size}</span>}
              </div>
            )}
          </div>
        );

      case "file":
        return (
          <div className="mt-2 p-3 rounded-lg bg-gray5 flex items-center gap-3">
            <div className="bg-gray6 p-2 rounded">
              <File size={24} className="text-theme" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              {attachment.size && (
                <p className="text-xs text-text3">{attachment.size}</p>
              )}
            </div>
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme hover:text-themeDark"
            >
              <Download size={20} />
            </a>
          </div>
        );

      case "link":
        return (
          <div className="mt-2 border border-gray rounded-lg overflow-hidden">
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-gray5"
            >
              {attachment.preview?.image && (
                <div className="relative w-full h-32">
                  <Image
                    src={attachment.preview.image}
                    alt={attachment.preview.title || "Link preview"}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="p-3">
                {attachment.preview?.title && (
                  <h4 className="text-sm font-medium mb-1">
                    {attachment.preview.title}
                  </h4>
                )}
                {attachment.preview?.description && (
                  <p className="text-xs text-text3 mb-1 line-clamp-2">
                    {attachment.preview.description}
                  </p>
                )}
                <p className="text-xs text-theme truncate">{attachment.url}</p>
              </div>
            </a>
          </div>
        );

      case "voice":
        return (
          <div className="mt-2 p-3 rounded-lg bg-gray5 flex items-center gap-3">
            <button className="bg-theme text-white p-2 rounded-full">
              <Play size={16} />
            </button>
            <div className="flex-1">
              <div className="w-full bg-gray6 rounded-full h-1.5">
                <div
                  className="bg-theme h-1.5 rounded-full"
                  style={{ width: "30%" }}
                ></div>
              </div>
            </div>
            <div className="text-xs">{attachment.duration || "0:00"}</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${isAdmin ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className="flex gap-3 max-w-[75%]">
        {/* Avatar (only for customer messages) */}
        {!isAdmin && (
          <div className="flex-shrink-0">
            <Image
              src={sender.avatar}
              alt={sender.name}
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>
        )}

        {/* Message content */}
        <div>
          <div
          className={`p-3 rounded-lg ${
              isAdmin
                ? "bg-themeLight text-black shadow-glow-xs"
                : "bg-gray5 text-black"
            }`}
          >
            {/* Message text */}
            {message.text && <p className="text-sm">{message.text}</p>}

            {/* Attachments */}
            {renderAttachment()}
          </div>

          {/* Time and read status */}
          <div
            className={`mt-1 flex items-center text-tiny text-text3 ${
              isAdmin ? "justify-end" : "justify-start"
            }`}
          >
            <span>{messageTime}</span>
            {isAdmin && (
              <span className="ml-1">
                {message.isRead ? (
                  <Check size={16} className="text-success" />
                ) : (
                  <Check size={16} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

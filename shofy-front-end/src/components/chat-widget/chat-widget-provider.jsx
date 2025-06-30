'use client'
import React from 'react';
import ChatWidget from './chat-widget';

const ChatWidgetProvider = ({ children }) => {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
};

export default ChatWidgetProvider;

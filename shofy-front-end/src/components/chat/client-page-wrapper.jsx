'use client'

import React from 'react';
import SimpleChatWidget from './simple-chat-widget';

const ClientPageWrapper = ({ children }) => {
  return (
    <>
      {children}
      <SimpleChatWidget />
    </>
  );
};

export default ClientPageWrapper;

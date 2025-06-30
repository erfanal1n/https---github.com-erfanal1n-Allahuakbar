'use client'
import React, { useState } from 'react';

const TestChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
      >
        {isOpen ? 'X' : '💬'}
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[300px] h-[400px] bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg">
            <h3>Chat with us</h3>
          </div>
          <div className="p-3">
            <p>This is a test chat widget.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestChatWidget;

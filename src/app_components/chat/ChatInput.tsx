// ChatInput.tsx
import React, { useState } from 'react';
import {ChatTextArea} from "@/app_components/chat/components/ChatTextArea.tsx";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  return (
      <ChatTextArea />
  );
};

export default ChatInput;
// ChatApp.tsx

import React, { useState } from "react";
import MessageList from "./MessageList";
import InputBar from "./InputBar";

function ChatApp() {
  // full transcript
  const [messages, setMessages] = useState<string[]>([]);

  // called when the user sends text
  const handleSend = (text: string) => {
    if (!text.trim()) return; // guard against empty input
    setMessages(prev => [...prev, `You: ${text}`, "Bot: (placeholder reply)"]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Support Chatbot</h2>
      <MessageList messages={messages} />
      <InputBar onSend={handleSend} />
    </div>
  );
}

export default ChatApp;

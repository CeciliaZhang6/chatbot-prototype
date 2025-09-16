// ChatApp.tsx
import React from "react";  
import MessageList from "./MessageList";
import InputBar from "./InputBar";

function ChatApp() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Support Chatbot</h2>
      <MessageList />
      <InputBar />
    </div>
  );
}

export default ChatApp;

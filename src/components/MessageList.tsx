// MessageList.tsx
import React from "react";
import type { Msg } from "../engine/ChatEngine";

// main component
export default function MessageList({ messages }: { messages: Msg[] }) {
  return (
    <div style={{ border: "1px solid #666", height: 320, overflowY: "auto", padding: 10 }}>
      {messages.map((m, i) => (
        <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left" }}>
          <strong>{m.sender === "user" ? "you" : "bot"}:</strong> {m.text}
        </div>
      ))}
    </div>
  );
}

// MessageList.tsx
import { useEffect, useRef } from "react";
import type { Msg } from "../engine/ChatEngine";

export default function MessageList({ messages }: { messages: Msg[] }) {
  // ref to scrollable box
  const boxRef = useRef<HTMLDivElement>(null);
  // ref to a dummy element at the very end
  const bottomRef = useRef<HTMLDivElement>(null);

  // scroll to bottom whenever a new message arrives
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    return () => cancelAnimationFrame(id);
  }, [messages.length]); // track length so it runs only when items are added

  return (
    <div
      ref={boxRef}
      style={{
        flex: 1,                 // fills vertical space
        overflowY: "auto",       // scroll within the current chat box
        padding: 10,
        backgroundColor: "#111",
        borderRadius: 8,
        fontSize: "clamp(14px, 1.5vw, 18px)"
      }}
    >
      {messages.map((m, i) => {
        const isUser = m.sender === "user";
        return (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: 8
            }}
          >
            <div
              style={{
                position: "relative",
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius: 12,
                backgroundColor: isUser ? "#0078ff" : "#444",
                color: "white",
                fontSize: "inherit",
                marginRight: isUser ? 8 : 0, // space for user tail
                marginLeft: isUser ? 0 : 8   // space for bot tail
              }}
            >
              <strong>{isUser ? "You: " : "Support: "}</strong>{m.text}
              <div
                style={{
                  content: '""',
                  position: "absolute",
                  top: "50%", // center vertically
                  transform: "translateY(-50%)",       
                  width: 0,
                  height: 0,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: isUser ? "none" : "10px solid #444",
                  borderRight: isUser ? "10px solid #0078ff" : "none",
                  right: isUser ? -10 : "auto",
                  left: isUser ? "auto" : -10,
                  borderRadius: 6,
                  marginRight: isUser ? 2 : 0, 
                  marginLeft: isUser ? 0 : 2 
                }}
              />
            </div>
          </div>
        );
      })}
      {/* sentinel at the very end */}
      <div ref={bottomRef} />
    </div>
  );
}

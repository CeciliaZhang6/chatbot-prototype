// src/components/InputBar.tsx
import { useState } from "react";

interface Props { onSend: (text: string) => void; disabled?: boolean; placeholder?: string; }

export default function InputBar({ onSend, disabled, placeholder }: Props) {
  const [input, setInput] = useState("");

  // decide what placeholder to show
  const inputPlaceholder =
    disabled && !placeholder
      ? "Thank you for using Support Chatbot! :)"
      : placeholder || "type your message...";
  
  const send = () => {
    if (disabled) return;
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && send()}
        placeholder={inputPlaceholder}
        style={{
          flex: 1,
          padding: "8px 12px",
          borderRadius: 20,
          border: "1px solid #666",
          backgroundColor: "#222",
          color: "white",
          outline: "none",
          fontSize: "clamp(14px, 1.5vw, 18px)" // auto adjust font size
        }}
        disabled={disabled}
      />
      <button
        onClick={send}
        disabled={disabled}
        style={{
          padding: "8px 16px",
          borderRadius: 20,
          border: "none",
          backgroundColor: disabled ? "#555" : "#0078ff",
          fontSize: "clamp(14px, 1.5vw, 18px)",
          color: "white",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "background-color 0.2s ease"
        }}
        onMouseOver={e => {
          if (!disabled) (e.currentTarget.style.backgroundColor = "#005fcc");
        }}
        onMouseOut={e => {
          if (!disabled) (e.currentTarget.style.backgroundColor = "#0078ff");
        }}
      >
        Send
      </button>
    </div>
  );
}

// InputBar.tsx

import { useState } from "react";

interface Props { onSend: (text: string) => void; disabled?: boolean }

export default function InputBar({ onSend, disabled }: Props) {
  // local state for the textbox
  const [input, setInput] = useState("");

  // notify parent and clear box
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
        placeholder="type here"
        style={{ flex: 1 }}
        disabled={disabled}
      />
      <button onClick={send} disabled={disabled}>send</button>
    </div>
  );
}

// InputBar.tsx

import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
}

function InputBar({ onSend }: Props) {
  // local state for the input field
  const [input, setInput] = useState("");

  // send text to ChatApp
  const handleSend = () => {
    if (!input.trim()) return; // ignore empty input
    onSend(input); 
    setInput(""); // reset input box
  };

  return (
    <div style={{ marginTop: 10 }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type here..."
        style={{ width: "80%" }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default InputBar;

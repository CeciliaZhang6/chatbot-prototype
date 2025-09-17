// ChatApp.tsx

import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import InputBar from "./InputBar";
import { ChatEngine } from "../engine/ChatEngine";

// single engine instance
const engine = new ChatEngine();

export default function ChatApp() {
  // simple counter to force re render when engine state changes
  const [, force] = useState(0);
  const rerender = () => force(x => x + 1);

  // init once on mount
  useEffect(() => {
    engine.init();
    rerender();
  }, []);

  // send user text through the engine
  const handleSend = (text: string) => {
    engine.send(text);
    rerender();
  };

  // disable input while engine is working or when ended
  const disabled =
    engine.state.appState === "processing" ||
    engine.state.appState === "ended";

  return (
    <div style={{ padding: 20 }}>
      <h2>Support Chatbot</h2>
      {/* render transcript from engine */}
      <MessageList messages={engine.state.history} />
      {/* input wired to engine */}
      <InputBar onSend={handleSend} disabled={disabled} />
      {engine.state.appState === "ended" && (
        <div style={{ marginTop: 8, opacity: 0.8 }}>
          chat ended; refresh page to start over
        </div>
      )}
    </div>
  );
}

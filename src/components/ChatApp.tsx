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
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#222"
    }}>
      <div style={{
        width: "50vw",        // 50% of screen width
        height: "75vh",       // 75% of screen height
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#111",
        borderRadius: 12,
        padding: 16,
        boxSizing: "border-box"
      }}>
        <h2 style={{ color: "white", margin: "0 0 10px 0", textAlign: "center" }}> ~~ Support Chatbot ~~ </h2>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <MessageList messages={engine.state.history} />
          <InputBar
            onSend={handleSend}
            disabled={disabled}
          />

        </div>


        <div style={{ position: "relative" }}>
        {engine.state.appState === "ended" && (
            <div style={{
              position: "absolute",
              bottom: "-48px", // just below input bar
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: 0.8,
              color: "white",
              fontSize: "1em"
            }}>
            Chat ended; refresh page to start over!
            </div>
        )}
        </div>
      </div>
    </div>
  );
}

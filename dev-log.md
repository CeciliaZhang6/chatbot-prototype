# Development Log — eGain Chatbot Take-Home Assignment

## Author: Cecilia Zhang

This log documents my step by step development progress for the **SWE Take-Home Assignment**.  
Scenario chosen: **Guiding a customer through a simple technical troubleshooting process**.

---

## Day 0 - Design and Planning

### Thought Process

A professional solution should include...

- A focus on the “Guiding a customer through troubleshooting” scenario
- A **clear folder structure**
- Separated UI responsibilities

Side note: although the suggested time breakdown (15 minutes planning, 30 minutes implementation) implies a very lightweight project on a micro scale, I believe that with the 2–3 day timeframe I will be able to design a slightly larger-scale solution that better aligns with professional standards and allows me to showcase my skills. Let's do it!

### My Decisions

- Use MVVM architecture with a minimal MVP scope (only ~2 days to work, keep it brief but viable)
- Chose **React + Vite + TypeScript** for quick iteration and polished demo via Vercel
- Planned for **JSON-driven flow** to separate conversation data from logic, making it easy to extend later
- Decided on **5 app states** (`init`, `next_step`, `processing`, `error_state`, `ended`) to keep the chatbot predictable

---

## Day 1 — Setup & UI Loop

### Goals

- Setup work repo and skeleton using React and Vite.
- Implement first working UI loop: input → message history → placeholder bot reply.

### Tasks Completed

- Created placeholder files for **ChatEngine**, **ChatApp**, **MessageList**, **InputBar**, and **useChatbot** hook.
- Confirmed local build runs with Vite dev server.
- Wired `InputBar` → `ChatApp` → `MessageList` to append new messages.
- Confirmed basic chat flow (user input + placeholder bot reply).
- Implemented UI Loop:
  - `ChatApp` owns the transcript (messages) as the single source of truth.
  - `InputBar` is a controlled input. When the user presses Enter/Send, it calls `onSend(text)`.
  - `ChatApp.handleSend` appends two lines to messages: the user line and a placeholder bot line.
  - React re-renders; `MessageList` receives messages as props and renders the transcript.
  - This isolates display (`MessageList`) from input handling (`InputBar`) and keeps state centralized (`ChatApp`), making it easy to swap the placeholder bot reply with the real `ChatEngine` later.

### Code Snippet — UI Loop

```tsx
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
```

---

## Day 2 — TBD

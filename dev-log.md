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

## Day 2 — Connect Chat Engine to UI + UI Polish

### Implementation

- integrated **ChatEngine** with `ChatApp`, `MessageList`, and `InputBar`
- implemented 5 app states (`init`, `next_step`, `processing`, `error_state`, `ended`)
- transcript now driven by `engine.state.history` instead of placeholder texts
- validated 2 error cases (empty description, invalid yes/no)
- fixed duplicate greeting issue caused by React StrictMode double invoking `init()`
- polished chat UI

### core concept — chat engine integration

The UI no longer owns its own transcript. Instead, it renders directly from `engine.state.history`.  
when the user sends input, chatapp calls `engine.send(text)` which validates and routes to the next node in the JSON flow.

Core Design:

- `ChatApp` delegates all logic to the engine
- `ChatEngine` enforces flow and state transitions
- UI only reflects `engine.state.history` and `engine.state.appState`

#### chatapp wiring

```tsx
// simplified chatapp
const engine = new ChatEngine();

useEffect(() => {
  engine.init();     // push first bot message
  rerender();
}, []);

const handleSend = (text: string) => {
  engine.send(text); // delegate to engine
  rerender();
};

return (
  <>
    <MessageList messages={engine.state.history} />
    <InputBar onSend={handleSend} disabled={engine.state.appState !== "next_step"} />
  </>
);
```

#### Engine state machine

```tsx
// five app states
type AppState = "init" | "next_step" | "processing" | "error_state" | "ended";

send(input: string) {
  this.pushUser(input);
  this.state.appState = "processing";

  const n = this.node;
  if (n.input === "free_text" && !input.trim()) return this.fail(n, "non_empty");

  if (n.input === "yes_no") {
    const v = normYesNo(input);
    if (v !== "yes" && v !== "no") return this.fail(n, "yes_no");
    return this.goto(v === "yes" ? "resolved" : "escalate");
  }

  if (n.onValid) return this.goto(n.onValid);
}
```

#### error handling

```tsx
private fail(n: Node, kind: "non_empty" | "yes_no") {
  const msg = n.validations?.find(v => v.kind === kind)?.errorMessage || "invalid input";
  this.pushBot(msg);
  this.state.appState = "error_state";
  // stay on same node, return to next_step for retry
  this.state.appState = "next_step";
}
```

#### Challenge 1 — Duplicate greeting on init

React StrictMode caused `useEffect` to run twice in dev mode, which triggered `engine.init()` twice and displayed the greeting message twice.

Fix: Removed (commented out) `StrictMode` wrapper in `main.tsx`.

#### Challenge 2 — Chat view scrolling & layout

At first, the chat box kept growing downward when messages overflowed, pushing the input bar off-screen, breaking the fixed “chat window” feel.

Fix: Used a flexbox container with `minHeight: 0` and `overflowY: auto` in `MessageList`. Then added a “sentinel” div at the bottom to auto-scroll into view whenever messages update, creating a smooth experience similar to texting.

```tsx
const bottomRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

return (
  <div style={{ flex: 1, overflowY: "auto" }}>
    {messages.map(...)}
    <div ref={bottomRef} />
  </div>
);
```

**Challenge 3 — Rejecting generic user inputs**  
At first, the bot accepted useless inputs like “hi” or “yes” as valid descriptions.  
**Fix:** Added a new `not_generic` validation to filter out greetings and yes/no responses at the `free_text` step.  

```tsx
if (n.input === "free_text") {
  const trimmed = input.trim().toLowerCase();
  const genericList = ["yes","no","y","n","yeah","nope","hi","hello","hey"];
  if (genericList.includes(trimmed)) {
    return this.fail(n, "not_generic");
  }
  if (n.onValid) return this.goto(n.onValid);
}

---

// ChatEngine.ts
// Skeleton for chatbot engine state machine

export type Message = { sender: "bot" | "user"; text: string };

export class ChatEngine {
  // Current state of the app
  state = {
    appState: "init" as "init" | "next_step" | "processing" | "error_state" | "ended",
    currentNodeId: "start",
    history: [] as Message[],
    error: null as string | null,
  };

  constructor() {
    // TODO: load flow.json and push initial bot message
  }

  send(input: string) {
    // TODO: handle user input, validation, routing
    console.log("User input:", input);
  }

  reset() {
    // TODO: reset state back to init
    console.log("Reset called");
  }
}

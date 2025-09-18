// src/components/ChatEngine.ts
import flow from "../data/flow.json";

export type AppState = "init" | "next_step" | "processing" | "error_state" | "ended";
export type Msg = { sender: "bot" | "user"; text: string };

// shape of nodes in json
type Node = {
  id: string;
  message: string;
  input: "none" | "free_text" | "yes_no";
  choices?: { label: string; value: string; next: string }[];
  validations?: { kind: "non_empty" | "yes_no"; errorMessage: string }[];
  onValid?: string;
  end?: boolean;
};

type Flow = Record<string, Node>;

function normYesNo(s: string) {
  // identify if user means yes or no
  const t = s.trim().toLowerCase();
  const yesList = ["y", "yes", "yeah", "yep", "yea", "ya", "sure", "ok", "okay"];
  const noList = ["n", "no", "nope", "nah", "not really"];

  if (yesList.includes(t)) return "yes";
  if (noList.includes(t)) return "no";

  return t;
}

export class ChatEngine {
  state = {
    appState: "init" as AppState,
    currentKey: "start",
    history: [] as Msg[],
    error: null as string | null,
  };

  private get node(): Node {
    return (flow as unknown as Flow)[this.state.currentKey];
  }

  init() {
    this.pushBot(this.node.message);
    if (this.node.input === "none") {
      this.state.appState = "processing";
      this.autoAdvance();
    } else {
      this.state.appState = "next_step";
    }
  }

  send(input: string) {
    if (this.state.appState === "ended") return;
    this.pushUser(input);
    this.state.appState = "processing";

    const n = this.node;

    // check if current node expects free text 
    if (n.input === "free_text") {
      const trimmed = input.trim().toLowerCase();
      if (!trimmed) return this.fail(n, "non_empty");

      const genericList = ["yes", "no", "y", "n", "yeah", "nope", "hi", "hello", "hey"];
      if (genericList.includes(trimmed)) {
        return this.fail(n, "not_generic");
      }

      if (n.onValid) return this.goto(n.onValid);
    }


    // check if suggestion works
    if (n.input === "yes_no") {
      const v = normYesNo(input);
      if (v !== "yes" && v !== "no") return this.fail(n, "yes_no");

      if (n.id === "suggest_restart") {
        return this.goto(v === "yes" ? "resolved" : "suggest_plug");
      }
      if (n.id === "suggest_plug") {
        return this.goto(v === "yes" ? "resolved" : "escalate");
      }
      return this.goto(v === "yes" ? "resolved" : "escalate");
    }
  }

  private goto(key: string) {
    // clear old error and update current node
    this.state.error = null;
    this.state.currentKey = key;
    const next = this.node;

    // push the bot message for this node
    this.pushBot(next.message);

    // if node is marked as end, stop the chat
    if (next.end) {
      this.state.appState = "ended";
      return;
    }

    // if node requires no input auto advance again
    if (next.input === "none") {
      this.state.appState = "processing";
      this.autoAdvance();
    } else {
      // otherwise wait for next user input
      this.state.appState = "next_step";
    }
  }

  private fail(n: Node, kind: "non_empty" | "yes_no" | "not_generic") {
    // pick error message from node validations or use default
    const msg =
        n.validations?.find(v => v.kind === kind)?.errorMessage ||
        "sorry i did not catch that";
    // store error and display to user
    this.state.error = msg;
    this.pushBot(msg);
    // mark error state then return to waiting for input
    this.state.appState = "error_state";
    this.state.appState = "next_step";
  }

  private autoAdvance() {
    // walk through nodes that need no input
    while (this.node.input === "none" && !this.node.end) {
      const nextKey = this.node.onValid || this.node.choices?.[0]?.next;
      if (!nextKey) break;
      this.state.currentKey = nextKey;
      this.pushBot(this.node.message);
    }
    this.state.appState = this.node.end ? "ended" : "next_step";
  }

  private pushBot(text: string) {
    this.state.history.push({ sender: "bot", text });
  }
  private pushUser(text: string) {
    this.state.history.push({ sender: "user", text });
  }
}

// ChatEngine.ts
import flow from "../data/flow.json";

export type AppState = "init" | "next_step" | "processing" | "error_state" | "ended";
export type Msg = { sender: "bot" | "user"; text: string };

// shape of nodes in your json
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
  const t = s.trim().toLowerCase();
  if (/(^y$|^yes$|yeah|yep|sure|ok)/.test(t)) return "yes";
  if (/(^n$|^no$|nope|nah)/.test(t)) return "no";
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

    if (n.input === "free_text") {
      if (!input.trim()) return this.fail(n, "non_empty");
      if (n.onValid) return this.goto(n.onValid);
    }

    if (n.input === "yes_no") {
      const v = normYesNo(input);
      if (v !== "yes" && v !== "no") return this.fail(n, "yes_no");
      const next =
        n.choices?.find(c => c.value === v)?.next ??
        (v === "yes" ? "resolved" : "escalate");
      return this.goto(next);
    }
  }

  private goto(key: string) {
    this.state.error = null;
    this.state.currentKey = key;
    const next = this.node;

    this.pushBot(next.message);

    if (next.end) {
      this.state.appState = "ended";
      return;
    }

    if (next.input === "none") {
      this.state.appState = "processing";
      this.autoAdvance();
    } else {
      this.state.appState = "next_step";
    }
  }

  private fail(n: Node, kind: "non_empty" | "yes_no") {
    const msg =
      n.validations?.find(v => v.kind === kind)?.errorMessage ||
      "sorry i did not catch that";
    this.state.error = msg;
    this.pushBot(msg);
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

// MessageList.tsx

interface Props {
  messages: string[];
}

function MessageList({ messages }: Props) {
  // render messages
  return (
    <div style={{ border: "1px solid #ccc", height: 300, overflowY: "auto" }}>
      {messages.map((m, i) => (
        <div key={i}>{m}</div>
      ))}
    </div>
  );
}

export default MessageList;

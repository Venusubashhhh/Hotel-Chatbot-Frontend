import "./ChatBubble.style.scss";

export default function BotBubble({ time, message = "" }) {
  return (
    <div className="chat-bubble">
      <div className="botBubble">
        {message}
        <div className="time">{`${time.getHours()}:${time.getMinutes()}`}</div>
      </div>
    </div>
  );
}

import { useState } from "react";
import "./ChatBubble.style.scss";
import { Button } from "@mui/material";

export default function ChatBubble({ time, chatData }) {
  const [disableInputs, setDisableInputs] = useState(chatData.disable || false);

  return (
    <>
      {chatData.input && chatData.input === "yn" ? (
        <div className="chat-bubble">
          <div className="yesno-container">
            <Button
              size="small"
              disabled={disableInputs}
              variant="outlined"
              onClick={() => {
                setDisableInputs(true);
                chatData.onYes();
              }}
            >
              Yes
            </Button>
            <Button
              size="small"
              variant="outlined"
              disabled={disableInputs}
              onClick={() => {
                setDisableInputs(true);
                chatData.onNo();
              }}
            >
              No
            </Button>
          </div>
        </div>
      ) : (
        <div className="chat-bubble">
          <div className="userBubble">
            {chatData.message}
            <div className="user-time">{`${time.getHours()}:${time.getMinutes()}`}</div>
          </div>
        </div>
      )}
    </>
  );
}

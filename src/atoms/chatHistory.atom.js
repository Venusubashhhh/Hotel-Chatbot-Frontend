import { atom } from "recoil";

const chat = atom({
  key: "chatHistory",
  default: [],
});

export default chat;

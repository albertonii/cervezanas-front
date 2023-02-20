import { FunctionComponent } from "react";
import { MessageListProps } from "./message.types";
import Message from "./Message";

export const MessageList: FunctionComponent<MessageListProps> = ({
  messages,
}) => (
  <div className="app-messages absolute w-screen -top-[9rem] pr-[10%] flex flex-col place-items-end justify-start z-50">
    {messages.map((message, index) => (
      <Message key={index} type={message.type} message={message.message} />
    ))}
  </div>
);

export default MessageList;

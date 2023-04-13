import { FunctionComponent } from "react";
import { Message } from ".";
import { MessageListProps } from "./message.types";

export const MessageList: FunctionComponent<MessageListProps> = ({
  messages,
}) => {
  return (
    <div className="app-messages fixed w-screen top-100 pr-[10%] flex flex-col place-items-end justify-start z-50">
      {messages.map((message, index) => (
        <Message key={index} type={message.type} message={message.message} />
      ))}
    </div>
  );
};

export default MessageList;

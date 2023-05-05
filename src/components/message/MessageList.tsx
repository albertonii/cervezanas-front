import { FunctionComponent } from "react";
import { Message } from ".";
import { MessageListProps } from "./message.types";

export const MessageList: FunctionComponent<MessageListProps> = ({
  messages,
}) => {
  return (
    <div className="app-messages absolute top-[8%] z-50 flex w-screen flex-col place-items-end justify-start pr-[10%]">
      {messages.map((message, index) => (
        <Message key={index} type={message.type} message={message.message} />
      ))}
    </div>
  );
};

export default MessageList;

"use client";

import { Message } from "./Message";
import { useMessage } from "./useMessage";

export const MessageList = () => {
  const { messages } = useMessage();

  return (
    <div className="app-messages absolute top-[12%] z-[19] flex  w-screen flex-col place-items-end justify-start space-y-2 pr-[12%] md:top-[0%]">
      {messages.map((message, index) => (
        <Message key={index} type={message.type} message={message.message} />
      ))}
    </div>
  );
};

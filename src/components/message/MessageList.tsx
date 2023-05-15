"use client";

import { Message, useMessage } from ".";

export const MessageList = () => {
  const { messages } = useMessage();

  return (
    <div className="app-messages absolute top-[12%] z-[19]  flex w-screen flex-col place-items-end justify-start pr-[10%] md:top-[8%]">
      {messages.map((message, index) => (
        <Message key={index} type={message.type} message={message.message} />
      ))}
    </div>
  );
};

export default MessageList;

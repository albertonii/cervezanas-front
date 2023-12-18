"use client";

import { Message } from "./Message";
import { useMessage } from "./useMessage";

export const MessageList = () => {
  const { messages } = useMessage();

  return (
    <section
      id="app-messages-list"
      className="sticky top-12 z-[19] flex h-0 flex-col place-items-end justify-start space-y-2 pr-[4%]"
    >
      {messages.map((message, index) => (
        <Message key={index} type={message.type} message={message.message} />
      ))}
    </section>
  );
};

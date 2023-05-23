"use client";

import { createContext, useState } from "react";
import { MessageProps } from "./message.types";

export type MessageContextProps = {
  messages: MessageProps[];
  handleMessage: (m: MessageProps) => void;
  clearMessages: () => void;
};

export const MessageContext = createContext<MessageContextProps>({
  messages: [],
  handleMessage: () => void {},
  clearMessages: () => void {},
});

interface Props {
  children: React.ReactNode;
}

export const MessageProvider = ({ children }: Props) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const handleMessage = (message: MessageProps) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setTimeout(() => {
      setMessages(messages.slice(1));
    }, 15000);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <MessageContext.Provider value={{ messages, handleMessage, clearMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

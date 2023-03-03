import {
  createContext,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
} from "react";
import { MessageProps } from "./message.types";

export type MessageContextProps = {
  messages: MessageProps[];
  setMessages: Dispatch<SetStateAction<MessageProps[]>>;
  handleMessage: (m: MessageProps) => void;
};

export const MessageContext = createContext<Partial<MessageContextProps>>({});

interface Props {
  children: React.ReactNode;
}

export const MessageProvider = ({ children }: Props) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const handleMessage = (message: MessageProps) => {
    setMessages((prevMessages) => prevMessages.concat([message]));
    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.slice(1));
    }, 15000);
  };

  return (
    <MessageContext.Provider value={{ messages, setMessages, handleMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

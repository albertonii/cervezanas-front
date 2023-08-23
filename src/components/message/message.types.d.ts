export type MessageType = "default" | "success" | "error" | "loading";

export type MessageProps = {
  type: MessageType;
  message: string;
};

export type MessageListProps = {
  messages: MessageProps[];
};

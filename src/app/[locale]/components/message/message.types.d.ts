export type MessageType =
  | "default"
  | "success"
  | "error"
  | "loading"
  | "warning"
  | "info";

export type MessageProps = {
  type: MessageType;
  message: string;
};

export type MessageListProps = {
  messages: MessageProps[];
};

import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Label({ children }: Props) {
  return (
    <label className="flex h-12 flex-col items-start space-y-2">
      {children}
    </label>
  );
}

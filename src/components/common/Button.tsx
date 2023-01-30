import React, { useState } from "react";

export interface ButtonTypes {
  type: "button" | "submit" | "reset" | "undefined";
}

interface ButtonProps {
  onClick: () => void;
  isActive: boolean;
  color?: { filled: string; unfilled: string };
  class: string;
  children?: React.ReactNode;
  title: string;
  box?: boolean;
  danger?: boolean;
  small?: boolean;
  // type: ButtonTypes;
}

export default function Button({
  onClick,
  isActive,
  children,
  class: className,
  box,
  danger,
  small,
}: ButtonProps) {
  const [hoverColor, _] = useState(isActive ? "filled" : "unfilled");

  return (
    <button
      type="button"
      onClick={onClick}
      color={hoverColor}
      className={`btn icon-btn ${className} 
      flex items-center justify-center bg-beer-foam hover:bg-beer-softBlonde border-beer-softBlonde border-2 rounded-full mt-0
      ${box ? "h-auto w-10" : ""}
      ${danger ? "bg-red-500 hover:bg-red-600 " : ""}
                            // type={undefined}
      ${small ? "w-auto" : ""}
      `}
    >
      <span
        className={`text-bear-dark text-xl ${danger ? "text-beer-foam" : ""}`}
      >
        {children}
      </span>
    </button>
  );
}

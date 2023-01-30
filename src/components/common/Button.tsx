import React, { useState } from "react";

export interface ButtonTypes {
  type?:
    | "primary"
    | "default"
    | "secondary"
    | "outline"
    | "dashed"
    | "link"
    | "text";
}

interface ButtonProps {
  onClick?: () => void;
  isActive: boolean;
  color?: { filled: string; unfilled: string };
  class: string;
  children?: React.ReactNode;
  title: string;
  box?: boolean;
  danger?: boolean;
  small?: boolean;
  medium?: boolean;
  disabled?: boolean;
  primary?: boolean;
}

export default function Button({
  onClick,
  isActive,
  children,
  class: className,
  box,
  danger,
  small,
  medium,
  disabled,
  primary,
}: ButtonProps) {
  const [hoverColor, _] = useState(isActive ? "filled" : "unfilled");

  return (
    <button
      type="button"
      onClick={onClick}
      color={hoverColor}
      className={`btn icon-btn ${className} 
      flex items-center justify-center bg-beer-foam  border-beer-softBlonde border-2 rounded mt-0
      ${box ? "h-auto w-10" : ""}
      ${danger ? "bg-red-500 hover:bg-red-600 " : ""}
      ${small ? "w-auto" : ""} 
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      ${medium ? "w-32" : ""}
      ${
        primary
          ? " bg-beer-softBlonde hover:bg-beer-blonde"
          : "hover:bg-beer-softBlonde"
      }
      `}
    >
      <span
        className={`text-xl 
        ${danger ? "text-beer-foam" : ""} 
        ${primary ? "text-beer-dark hover:text-beer-foam" : "text-beer-dark"}}`}
      >
        {children}
      </span>
    </button>
  );
}

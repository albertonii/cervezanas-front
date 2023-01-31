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
  isActive?: boolean;
  color?: { filled: string; unfilled: string };
  class: string;
  children?: React.ReactNode;
  title: string;
  box?: boolean;
  danger?: boolean;
  small?: boolean;
  medium?: boolean;
  large?: boolean;
  xLarge?: boolean;
  xxLarge?: boolean;
  disabled?: boolean;
  primary?: boolean;
  accent?: boolean;
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
  large,
  xLarge,
  xxLarge,
  disabled,
  primary,
  accent,
}: ButtonProps) {
  const [hoverColor, _] = useState(isActive ? "filled" : "unfilled");

  return (
    <button
      type="button"
      onClick={onClick}
      color={hoverColor}
      className={`
      flex items-center justify-center bg-beer-foam  border-beer-softBlonde border-2 rounded mt-0
      ${box ? "h-auto w-10" : ""}
      ${danger ? "bg-red-500 hover:bg-red-600 " : ""}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      ${small ? "w-24" : ""} 
      ${medium ? "w-32" : ""}
      ${large ? "w-52" : ""}
      ${xLarge ? "w-64" : ""}
      ${xxLarge ? "w-80" : ""}
      ${
        primary
          ? " bg-beer-softBlonde hover:bg-beer-blonde"
          : "hover:bg-beer-softBlonde"
      }
      ${accent ? "bg-beer-foam" : ""}
      ${className} 
      `}
    >
      <span
        className={` 
        ${danger ? "text-beer-foam " : ""} 
        ${primary ? "text-beer-dark " : "text-beer-dark"}}
        ${accent ? "text-beer-dark hover:text-beer-dark" : ""}
        ${small ? "px-4 py-2 text-md" : ""} 
        ${medium ? "px-4 py-2 text-base" : ""}
        ${large ? "px-5 py-3 text-lg" : ""}
        ${xLarge ? "px-6 py-3 text-xl" : ""}
        ${xxLarge ? "px-6 py-3 text-2xl" : ""}
      `}
      >
        {children}
      </span>
    </button>
  );
}

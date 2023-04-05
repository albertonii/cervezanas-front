import React, { useState } from "react";

interface ButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  color?: { filled: string; unfilled: string };
  class?: string;
  children?: React.ReactNode;
  title?: string;
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
  btnType?: string;
  form?: string;
}

export function Button({
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
  btnType,
  form,
}: ButtonProps) {
  const [hoverColor, _] = useState(isActive ? "filled" : "unfilled");

  const getButtonType = () => {
    switch (btnType) {
      case "submit":
        return "submit";
      default:
        return "button";
    }
  };

  return (
    <button
      disabled={disabled}
      type={`${getButtonType()}`}
      onClick={onClick}
      color={hoverColor}
      form={form}
      className={`
        flex items-center justify-center border-beer-foam border-2 rounded mt-0
        ${box ? "h-auto w-10" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${small ? "w-24" : ""} 
        ${medium ? "w-48" : ""}
        ${large ? "w-52" : ""}
        ${xLarge ? "w-64" : ""}
        ${xxLarge ? "w-80" : ""}
        ${
          primary
            ? " bg-beer-softBlonde hover:bg-beer-blonde "
            : "hover:bg-beer-softBlonde shrink-0"
        }
        ${accent ? "bg-beer-foam border-beer-blonde" : ""}
        ${danger ? "bg-red-400  hover:bg-red-500 " : ""}
        ${className} 
      `}
    >
      <span
        className={` 
        ${danger ? "text-beer-foam font-semibold" : ""} 
        ${primary ? "text-beer-dark font-semibold" : "text-beer-dark"}}
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

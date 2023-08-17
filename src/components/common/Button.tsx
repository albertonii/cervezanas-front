import React from "react";

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
  fullSize?: boolean;
  isLoading?: boolean;
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
  fullSize,
  isLoading,
}: ButtonProps) {
  const hoverColor = isActive ? "filled" : "unfilled";

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
      disabled={disabled || isLoading}
      type={`${getButtonType()}`}
      onClick={onClick}
      color={hoverColor}
      form={form}
      className={`
        mt-0 flex items-center justify-center rounded border-2 border-beer-blonde transition duration-100 ease-in
        ${box ? "h-auto w-10" : ""}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${small ? "w-24" : ""} 
        ${medium ? "w-48" : ""}
        ${large ? "w-52" : ""}
        ${xLarge ? "w-64" : ""}
        ${xxLarge ? "w-80" : ""}
        ${fullSize ? "w-full" : ""}
        ${
          primary
            ? " border-2 border-beer-blonde bg-beer-softBlonde hover:bg-beer-blonde"
            : "shrink-0 hover:bg-beer-softBlonde"
        }
        ${accent ? "border-2 border-beer-blonde bg-beer-foam" : ""}
        ${danger ? "bg-red-500  hover:bg-red-600 " : ""}
        ${
          isLoading &&
          "border-2 border-beer-foam bg-beer-softFoam text-beer-dark"
        } 
        ${className} 
      `}
    >
      <span
        className={` 
        ${danger ? "font-semibold text-beer-foam" : ""} 
        ${primary ? "font-semibold text-beer-dark" : "text-beer-dark"}}
        ${accent ? "text-beer-dark hover:text-beer-dark" : ""}
        ${small ? "text-md px-4 py-2" : ""} 
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

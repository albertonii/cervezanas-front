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
  isActive = false,
  children,
  class: className = "",
  box,
  danger = false,
  small = false,
  medium = false,
  large = false,
  xLarge = false,
  xxLarge = false,
  disabled = false,
  primary = false,
  accent = false,
  btnType = "",
  form, // If set to empty string, the button will not be a submit button
  fullSize = false,
  isLoading = false,
}: ButtonProps) {
  const hoverColor = isActive ? "filled" : "unfilled";

  const getSizeClass = () => {
    if (small) return "text-md px-4";
    if (medium) return "px-4 text-base";
    if (large) return "px-5 text-lg";
    if (xLarge) return "px-6 text-xl";
    if (xxLarge) return "px-6 text-2xl";
    return "";
  };

  const getColorClass = () => {
    if (primary)
      return "border-2 border-beer-blonde bg-beer-softBlonde hover:bg-beer-blonde";
    if (accent)
      return "border-2 border-beer-blonde bg-beer-foam hover:bg-beer-softFoam";
    if (danger) return "bg-red-500 hover:bg-red-600";
    return "shrink-0 hover:bg-beer-softBlonde";
  };

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
        mt-0 flex items-center
        justify-center rounded border-2 border-beer-blonde py-1 transition duration-100 ease-in focus:outline-none focus:ring focus:ring-beer-softFoam
        ${getSizeClass()}
        ${getColorClass()}
        ${box ? "h-auto w-10" : ""}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${fullSize ? "w-full" : ""}
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
        ${getSizeClass()}


      `}
      >
        {children}
      </span>
    </button>
  );
}

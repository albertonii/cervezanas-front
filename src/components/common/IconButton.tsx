import React, { useMemo, useState } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IconButtonProps {
  icon: IconDefinition;
  onClick?: () => void;
  isActive?: boolean;
  color?: { filled: string; unfilled: string };
  classContainer?: string;
  classIcon?: string;
  classSpanChildren?: string;
  children?: React.ReactNode;
  title: string;
  box?: boolean;
  danger?: boolean;
  disabled?: boolean;
  primary?: boolean;
  accent?: boolean;
  btnType?: string;
  size?: "small" | "medium" | "large" | "xLarge" | "xxLarge";
}

export function IconButton({
  icon,
  onClick,
  isActive,
  color,
  children,
  classContainer: classNameContainer,
  classIcon: classNameIcon,
  classSpanChildren: classNameSpan,
  title,
  box,
  danger,
  disabled,
  primary,
  accent,
  btnType,
  size,
}: IconButtonProps) {
  const [hoverColor, setHoverColor] = useState(
    isActive ? "filled" : "unfilled"
  );

  const iconButton = useMemo(() => {
    const getColor = () => {
      return isActive ? color?.filled : color?.unfilled;
    };

    return (
      <FontAwesomeIcon
        className={`${classNameIcon} `}
        icon={icon}
        style={{ color: getColor() }}
        onMouseEnter={() => setHoverColor("filled")}
        onMouseLeave={() => setHoverColor("unfilled")}
        onClick={onClick}
        title={title}
      />
    );
  }, [
    classNameIcon,
    color?.filled,
    color?.unfilled,
    icon,
    isActive,
    onClick,
    title,
  ]);

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
      type={`${getButtonType()}`}
      onClick={onClick}
      color={hoverColor}
      className={`
        flex items-center justify-center hover:bg-beer-softBlonde border-beer-softBlonde border-2 rounded mt-0
        ${box ? "h-auto w-10" : ""}
        ${danger ? "bg-red-500 hover:bg-red-600 " : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${size === "small" ? "w-24" : ""} 
        ${size === "medium" ? "w-32" : ""}
        ${size === "large" ? "w-52" : ""}
        ${size === "xLarge" ? "w-64" : ""}
        ${size === "xxLarge" ? "w-80" : ""}
        ${
          primary
            ? " bg-beer-softBlonde hover:bg-beer-blonde"
            : "hover:bg-beer-softBlonde"
        }
        ${accent ? "bg-beer-foam" : ""}
        ${classNameContainer} 
      `}
    >
      <span
        className={`${children != null ? "mr-1" : ""} text-bear-dark h-5 w-5`}
      >
        {iconButton}
      </span>

      <span
        className={`text-bear-dark
          ${danger ? "text-beer-foam " : ""} 
          ${primary ? "text-beer-dark " : "text-beer-dark"}}
          ${accent ? "text-beer-dark hover:text-beer-dark" : ""}
          ${size === "small" ? "px-4 py-2 text-md" : ""} 
          ${size === "medium" ? "px-4 py-2 text-base" : ""}
          ${size === "large" ? "px-5 py-3 text-lg" : ""}
          ${size === "xLarge" ? "px-6 py-3 text-xl" : ""}
          ${size === "xxLarge" ? "px-6 py-3 text-2xl" : ""}
          ${classNameSpan}
        `}
      >
        {children}
      </span>
    </button>
  );
}

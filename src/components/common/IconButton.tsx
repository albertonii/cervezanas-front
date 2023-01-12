import React, { useMemo, useState } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IconButtonProps {
  icon: IconDefinition;
  onClick: () => void;
  isActive: boolean;
  color: { filled: string; unfilled: string };
  class: string;
  children?: React.ReactNode;
  title: string;
}

export default function IconButton({
  icon,
  onClick,
  isActive,
  color,
  children,
  class: className,
  title,
}: IconButtonProps) {
  const [hoverColor, setHoverColor] = useState(
    isActive ? "filled" : "unfilled"
  );

  const iconButton = useMemo(() => {
    const getColor = () => {
      return isActive ? color.filled : color.unfilled;
    };

    return (
      <FontAwesomeIcon
        className={`${className} `}
        icon={icon}
        style={{ color: getColor() }}
        onMouseEnter={() => setHoverColor("filled")}
        onMouseLeave={() => setHoverColor("unfilled")}
        onClick={onClick}
        title={title}
      />
    );
  }, [className, color.filled, color.unfilled, icon, isActive, onClick, title]);

  return (
    <button
      onClick={onClick}
      color={hoverColor}
      className={`btn icon-btn ${className} 
      flex items-center justify-center
      `}
    >
      <span className={`${children != null ? "mr-1" : ""} `}>{iconButton}</span>
      {children}
    </button>
  );
}

"use client";

import React, { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
  content: ReactNode;
  direction?: "top" | "bottom" | "left" | "right";
  delay: number;
  width?: number;
}

export function Tooltip({
  children,
  content,
  direction,
  delay,
  width: w,
}: Props) {
  let timeout: any;

  const [active, setActive] = useState(false);

  const [width, setWidth] = useState(0);
  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  useEffect(() => {
    if (w) setWidth(w);
  }, [w]);

  return (
    <div
      className={`Tooltip-Wrapper align-items relative inline-block ${
        active ? "" : "opacity-100"
      }`}
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {/* Wrapping */}
      {children}
      <div
        style={{ width: `${width}px` }}
        className={`Tooltip-Tip 
          ${!active ? "hidden" : " transition-2"}
          ${direction === "top" ? "bottom-[150%]" : ""} 
          ${direction === "bottom" ? "top-[150%]" : ""} 
          ${direction === "left" ? "-left-[0%] -top-[100%]" : ""}
            left-1/2$z-50{dlex -transiatr-e-1/2 transformction === "right" ? "left-[25[100%]" : "bgbeeblod absolute
             left-1/2 z-50 flex -translate-x-1/2 transform items-center justify-center rounded-lg bg-beer-blonde px-4 py-3 text-sm leading-tight shadow-lg `}
      >
        {/* Content */}
        <p className="break-words ">{content}</p>
      </div>
    </div>
  );
}

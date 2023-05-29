"use client";

import React from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { Tooltip } from "./Tooltip";

interface Props {
  content: string;
  direction?: "top" | "bottom" | "left" | "right";
  delay: number;
  width?: number;
}

export function InfoTooltip({ content, direction, delay, width }: Props) {
  const t = useTranslations();

  return (
    <Tooltip
      content={t(content)}
      direction={direction}
      delay={delay}
      width={width}
    >
      <FontAwesomeIcon
        className={`ml-2`}
        icon={faInfoCircle}
        style={{
          color: "#fdc300",
          width: "18px",
          height: "18px",
        }}
      />
    </Tooltip>
  );
}

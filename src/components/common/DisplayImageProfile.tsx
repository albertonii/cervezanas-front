"use client";

import Image from "next/image";
import { ComponentProps } from "@stitches/core";
import { memo, useMemo, useState } from "react";
import { COMMON } from "../../constants";

// const BASE_PRODUCTS_ARTICLES_URL = SupabaseProps.BASE_PRODUCTS_ARTICLES_URL;

interface Props {
  imgSrc: string;
  onClick?: ComponentProps<typeof Image>["onClick"];
  class?: string;
  alt?: string;
  width?: number;
  height?: number;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
}

function DisplayImageProfile({
  imgSrc,
  onClick,
  class: class_,
  alt,
  width,
  height,
  objectFit,
}: Props) {
  const [imgSrc_, setImgSrc_] = useState<string>(imgSrc);
  const memoizedSrc = useMemo(() => imgSrc_, [imgSrc_]);

  return (
    <Image
      width={width ?? 120}
      height={height ?? 120}
      alt={alt ?? "image"}
      src={memoizedSrc}
      onError={() => setImgSrc_(COMMON.PROFILE_IMG)}
      onBlur={() => COMMON.PROFILE_IMG}
      onClick={onClick}
      className={`${class_}`}
      style={{ objectFit: objectFit ? objectFit : "cover" }}
    />
  );
}

export default memo(DisplayImageProfile);
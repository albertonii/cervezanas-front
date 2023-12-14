"use client";

import Image from "next/image";
import { COMMON } from "../../../../constants";
import { ComponentProps } from "@stitches/core";
import { memo, useEffect, useMemo, useState } from "react";

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

function DisplayImageProduct({
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

  useEffect(() => {
    setImgSrc_(imgSrc);
  }, [imgSrc]);

  return (
    <Image
      width={width ?? 120}
      height={height ?? 120}
      alt={alt ?? "image"}
      src={
        "https://nzlovxxjnbrzfykphpaj.supabase.co/storage/v1/object/public/products/articles/1007b556-a343-4988-a879-bd62cb29c2e2/p_principal/6f77073d-3420-4af8-8e39-a0acd8d24bda.jpg"
      }
      onError={() => setImgSrc_(COMMON.NO_BEER)}
      onBlur={() => COMMON.MARKETPLACE_PRODUCT}
      onClick={onClick}
      className={`${class_}`}
      style={{ objectFit: objectFit ? objectFit : "cover" }}
    />
  );
}

export default memo(DisplayImageProduct);

import { ComponentProps } from "@stitches/core";
import Image from "next/image";
import { useState } from "react";
import { SupabaseProps } from "../../constants";
import { isValidObject } from "../../utils/utils";

interface Props {
  src: string;
  onClick?: ComponentProps<typeof Image>["onClick"];
  class?: string;
  alt?: string;
  width?: number;
  height?: number;
  isBasePath?: boolean;
}

export default function DisplayImageString({
  src: src_,
  onClick,
  class: class_,
  alt,
  width,
  height,
  isBasePath,
}: Props) {
  const [src, setSrc] = useState(
    isBasePath ? src_ : SupabaseProps.BASE_PRODUCTS_ARTICLES_URL + src_
  );
  if (!isValidObject(src)) return null;

  return (
    <Image
      width={width ?? 120}
      height={height ?? 120}
      alt={alt ?? "image"}
      src={src}
      onError={() => setSrc("/marketplace_product_default.png")}
      onClick={onClick}
      className={class_}
    />
  );
}

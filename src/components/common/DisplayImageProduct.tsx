import Image from "next/image";
import { ComponentProps } from "@stitches/core";
import { useState } from "react";
import { SupabaseProps } from "../../constants";

const BASE_PRODUCTS_ARTICLES_URL = SupabaseProps.BASE_PRODUCTS_ARTICLES_URL;
const MARKETPLACE_PRODUCT = "/marketplace_product_default.png";

interface Props {
  imgSrc: string;
  onClick?: ComponentProps<typeof Image>["onClick"];
  class?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function DisplayImageProduct({
  imgSrc,
  onClick,
  class: class_,
  alt,
  width,
  height,
}: Props) {
  const [src, setSrc] = useState(
    imgSrc === MARKETPLACE_PRODUCT
      ? MARKETPLACE_PRODUCT
      : BASE_PRODUCTS_ARTICLES_URL + imgSrc
  );

  return (
    <Image
      width={width ?? 120}
      height={height ?? 120}
      alt={alt ?? "image"}
      src={src}
      onError={() => setSrc(MARKETPLACE_PRODUCT)}
      onBlur={() => setSrc(MARKETPLACE_PRODUCT)}
      onClick={onClick}
      className={class_}
    />
  );
}

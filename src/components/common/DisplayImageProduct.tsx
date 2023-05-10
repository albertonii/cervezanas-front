import Image from "next/image";
import { ComponentProps } from "@stitches/core";
import { memo, useMemo, useState } from "react";
import { COMMON, SupabaseProps } from "../../constants";

const BASE_PRODUCTS_ARTICLES_URL = SupabaseProps.BASE_PRODUCTS_ARTICLES_URL;

interface Props {
  imgSrc: string;
  onClick?: ComponentProps<typeof Image>["onClick"];
  class?: string;
  alt?: string;
  width?: number;
  height?: number;
}

function DisplayImageProduct({
  imgSrc,
  onClick,
  class: class_,
  alt,
  width,
  height,
}: Props) {
  const [src, setSrc] = useState(
    imgSrc === COMMON.MARKETPLACE_PRODUCT
      ? COMMON.MARKETPLACE_PRODUCT
      : BASE_PRODUCTS_ARTICLES_URL + imgSrc
  );

  const memoizedSrc = useMemo(() => src, [src]);

  return (
    <Image
      width={width ?? 120}
      height={height ?? 120}
      alt={alt ?? "image"}
      src={memoizedSrc}
      onError={() => setSrc(COMMON.MARKETPLACE_PRODUCT)}
      onBlur={() => setSrc(COMMON.MARKETPLACE_PRODUCT)}
      onClick={onClick}
      className={`${class_}`}
      style={{ objectFit: "cover" }}
    />
  );
}

export default memo(DisplayImageProduct);

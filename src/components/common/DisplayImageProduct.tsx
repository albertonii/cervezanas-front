import Image from "next/image";
import { ComponentProps } from "@stitches/core";
import { useEffect, useState } from "react";
import { SupabaseProps } from "../../constants";
import { IProduct } from "../../lib/types.d";
import { isValidObject } from "../../utils/utils";

interface Props {
  product: IProduct;
  onClick?: ComponentProps<typeof Image>["onClick"];
  class?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function DisplayImageProduct({
  product,
  onClick,
  class: class_,
  alt,
  width,
  height,
}: Props) {
  const [src, setSrc] = useState(
    SupabaseProps.BASE_PRODUCTS_ARTICLES_URL +
      product.product_multimedia[0].p_principal
  );

  useEffect(() => {
    console.log(src);
  }, [src]);

  if (!isValidObject(product)) return null;

  if (!isValidObject(product.product_multimedia[0])) return null;

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

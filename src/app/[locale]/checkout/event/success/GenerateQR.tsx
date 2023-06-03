import React from "react";
import QRCode from "react-qr-code";
import { useLocale } from "next-intl";

interface Props {
  eventOrderItemId: string;
}

export default function GenerateProductQR({ eventOrderItemId }: Props) {
  const locale = useLocale();
  // const router = useRouter();

  const environmentState = process.env.NODE_ENV;

  const host =
    environmentState === "development"
      ? "http://localhost:3000"
      : "https://cervezanas.beer";

  const productUrl = `${host}/${locale}/barman/product/${eventOrderItemId}`;

  const handleOnClick = () => {
    // console.log(productUrl);
    // router.push(productUrl);
  };

  return (
    <div
      className="w-1/2 transition-all hover:scale-105"
      onClick={() => handleOnClick()}
    >
      {<QRCode value={productUrl} className="" />}
    </div>
  );
}

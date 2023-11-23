import React from "react";
import QRCode from "react-qr-code";
import { useLocale } from "next-intl";

interface Props {
  eventOrderItemId: string;
  domain: string;
}

export default function GenerateProductQR({ eventOrderItemId, domain }: Props) {
  const locale = useLocale();
  // const router = useRouter();

  const environmentState = process.env.NODE_ENV;

  const host =
    environmentState === "development"
      ? domain
      : "https://cervezanas-front.vercel.app";

  const productUrl = `${host}/${locale}/producer/barman/product/${eventOrderItemId}`;

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

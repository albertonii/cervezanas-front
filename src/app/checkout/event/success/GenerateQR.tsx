import { useRouter } from "next/navigation";
import React from "react";
import QRCode from "react-qr-code";

interface Props {
  eventOrderItemId: string;
}

export default function GenerateProductQR({ eventOrderItemId }: Props) {
  const productUrl = `${process.env.HOST}/barman/product/${eventOrderItemId}`;

  const router = useRouter();

  const handleOnClick = () => {
    router.push(productUrl);
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

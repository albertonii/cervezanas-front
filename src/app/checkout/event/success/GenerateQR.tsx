import { useRouter } from "next/navigation";
import React from "react";
import QRCode from "react-qr-code";

interface Props {
  eventOrderItemId: string;
}

export default function GenerateProductQR({ eventOrderItemId }: Props) {
  const productUrl = `http://localhost:3000/barman/product/${eventOrderItemId}`;
  console.log(productUrl);

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

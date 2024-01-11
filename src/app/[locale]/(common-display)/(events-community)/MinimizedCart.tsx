import React from "react";
import Image from "next/image";
import { useEventCart } from "../../../context/EventCartContext";
import { Button } from "../../components/common/Button";

interface Props {
  eventId: string;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MinimizedCart({ eventId, setIsMinimized }: Props) {
  const { getCartQuantity } = useEventCart();

  return (
    <Button onClick={() => setIsMinimized(false)}>
      <div className="flex flex-col items-center justify-center gap-2 p-1">
        <div className="relative rounded-full">
          <Image
            src={"/icons/shopping-cart.svg"}
            loader={() => "/icons/shopping-cart.svg"}
            alt={"Go to Shopping cart"}
            className={"rounded-full"}
            width={0}
            height={0}
            style={{ width: "60px", height: "60px" }}
          />
          <span className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
            {getCartQuantity(eventId)}
          </span>
        </div>
      </div>
    </Button>
  );
}

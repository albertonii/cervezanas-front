import React from "react";
import { DeleteButton } from "./DeleteButton";
import { IconButton } from "./IconButton";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface Props {
  quantity: number;
  item: any;
  handleIncreaseCartQuantity: () => void;
  handleDecreaseCartQuantity: () => void;
  handleRemoveFromCart: (id: string) => void;
  displayDeleteButton?: boolean;
}

export default function MarketCartButtons({
  quantity,
  item,
  handleIncreaseCartQuantity,
  handleDecreaseCartQuantity,
  handleRemoveFromCart,
  displayDeleteButton,
}: Props) {
  return (
    <>
      <div className="mr-2 flex items-center justify-center space-x-2 rounded-md border">
        <span className="mx-2 text-xl text-beer-draft w-[30px] text-center">{quantity}</span>

        <div className="flex flex-col ">
          <div className="border">
            <IconButton
              onClick={() => handleIncreaseCartQuantity()}
              classContainer="rounded-none border-none p-1 hover:bg-beer-softBlonde"
              classIcon={""}
              icon={faChevronUp}
              title={""}
            ></IconButton>
          </div>

          <div className="border">
            <IconButton
              onClick={() => handleDecreaseCartQuantity()}
              classContainer="rounded-none border-none p-1 hover:bg-beer-softBlonde"
              classIcon={""}
              icon={faChevronDown}
              title={""}
            ></IconButton>
          </div>
        </div>

        {displayDeleteButton && (
          <DeleteButton onClick={() => handleRemoveFromCart(item.id)} />
        )}
      </div>
    </>
  );
}

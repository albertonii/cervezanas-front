import React from "react";
import { DeleteButton, DecreaseButton, IncreaseButton } from ".";

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
      <div className="flex">
        <div className="mr-2 flex items-center justify-center space-x-2">
          <DecreaseButton onClick={() => handleDecreaseCartQuantity()} />

          <span className="mx-2 text-xl text-beer-draft">{quantity}</span>

          <IncreaseButton onClick={() => handleIncreaseCartQuantity()} />

          {displayDeleteButton && (
            <DeleteButton onClick={() => handleRemoveFromCart(item.id)} />
          )}
        </div>
      </div>
    </>
  );
}

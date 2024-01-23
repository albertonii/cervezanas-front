import React from "react";
import { DeleteButton } from "./DeleteButton";
import { IconButton } from "./IconButton";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import debounce from "debounce";

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
  const onClickIncreaseDebounce = debounce(handleIncreaseCartQuantity, 100);
  const onClickDecreaseDebounce = debounce(handleDecreaseCartQuantity, 100);

  return (
    <section className="mr-2 flex items-center justify-center space-x-2 rounded-md border">
      <span className="mx-2 w-[30px] text-center text-xl text-beer-draft">
        {quantity}
      </span>

      <div className="flex flex-col ">
        <figure className="border">
          <IconButton
            onClick={() => onClickIncreaseDebounce()}
            classContainer="rounded-none border-none p-1 hover:bg-beer-softBlonde"
            classIcon={""}
            icon={faChevronUp}
            title={""}
          ></IconButton>
        </figure>

        <figure className="border">
          <IconButton
            onClick={() => onClickDecreaseDebounce()}
            classContainer="rounded-none border-none p-1 hover:bg-beer-softBlonde"
            classIcon={""}
            icon={faChevronDown}
            title={""}
          ></IconButton>
        </figure>
      </div>

      {displayDeleteButton && (
        <DeleteButton onClick={() => handleRemoveFromCart(item.id)} />
      )}
    </section>
  );
}

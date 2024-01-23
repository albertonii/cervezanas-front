import MinimizedCart from "./MinimizedCart";
import MaxifiedCart from "./MaxifiedCart";
import React, { useEffect, useState } from "react";
import { IProductPackEventCartItem } from "../../../../../../../lib/types";
import useEventCartStore from "../../../../../../store/eventCartStore";

interface Props {
  eventId: string;
}

export default function EventCart({ eventId }: Props) {
  const [isMinimized, setIsMinimized] = React.useState<boolean>(false);

  const { eventCarts, existEventCart, createNewCart } = useEventCartStore();

  const [items, setItems] = useState<IProductPackEventCartItem[]>([]);

  useEffect(() => {
    if (!existEventCart(eventId)) {
      createNewCart(eventId);
    }

    setItems(eventCarts[eventId]);
  }, [eventCarts]);

  return (
    <section
      className={`md:right- fixed -top-44 right-10 z-40 rounded-lg border-2 border-beer-softBlonde bg-beer-softFoam px-2 py-2 shadow-md md:relative md:-top-40 md:left-0 md:right-auto top-0 left-0 w-[90px]`}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      {isMinimized ? (
        <MinimizedCart eventId={eventId} setIsMinimized={setIsMinimized} />
      ) : (
        <MaxifiedCart
          setIsMinimized={setIsMinimized}
          items={items}
          eventId={eventId}
        />
      )}
    </section>
  );
}

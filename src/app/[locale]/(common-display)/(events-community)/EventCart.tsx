import MinimizedCart from "./MinimizedCart";
import MaxifiedCart from "./MaxifiedCart";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { IProductPackCartItem } from "../../../../lib/types.d";
import { useEventCart } from "../../../../context/EventCartContext";

export default function EventCart() {
  const locale = useLocale();
  const router = useRouter();

  const [isMinimized, setIsMinimized] = React.useState<boolean>(false);

  const { eventItems } = useEventCart();

  const [items, setItems] = useState<IProductPackCartItem[]>([]);

  useEffect(() => {
    setItems(eventItems);
  }, [eventItems]);

  const handleCheckout = () => {
    router.push(`/${locale}/cart/event_basket`);
  };

  return (
    <section
      className={`md:right- fixed -top-44 right-10 z-40 rounded-lg border-2 border-beer-softBlonde bg-beer-softFoam px-2 py-2 shadow-md md:absolute md:-top-20 md:left-0 md:right-auto`}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      {isMinimized ? (
        <MinimizedCart setIsMinimized={setIsMinimized} />
      ) : (
        <MaxifiedCart
          setIsMinimized={setIsMinimized}
          items={items}
          handleCheckout={handleCheckout}
        />
      )}
    </section>
  );
}

import Image from "next/image";
import EventProduct from "./EventProduct";
import EmptyCart from "../cart/shopping_basket/EmptyCart";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/common/Button";
import { useEventCart } from "../../../../context/EventCartContext";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { IProductPackCartItem } from "../../../../lib/types.d";

export default function EventCart() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [isMinimized, setIsMinimized] = React.useState<boolean>(false);

  const { eventItems, cartQuantity } = useEventCart();

  const [items, setItems] = useState<IProductPackCartItem[]>([]);

  useEffect(() => {
    setItems(eventItems);
  }, [eventItems]);

  const handleCheckout = () => {
    router.push(`/${locale}/cart/event_basket`);
  };

  return (
    <div
      className={`md:right- fixed -top-44 right-10 z-40 rounded-lg border-2 border-beer-softBlonde bg-beer-softFoam px-2 py-2 shadow-md md:absolute md:-top-20 md:left-0 md:right-auto`}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      {isMinimized ? (
        <>
          <Button onClick={() => setIsMinimized(false)}>
            <div className="flex flex-col items-center justify-center gap-2 p-1">
              <div className="relative rounded-full">
                <Image
                  src={"/icons/shopping-cart.svg"}
                  width={60}
                  height={60}
                  alt={"Go to Shopping cart"}
                  className={"rounded-full"}
                />
                <span className="white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-blonde">
                  {cartQuantity}
                </span>
              </div>
            </div>
          </Button>
        </>
      ) : (
        <div
          className={`flex w-screen max-w-sm flex-col items-end transition-all ${
            isMinimized && ""
          }`}
        >
          <Button onClick={() => setIsMinimized(true)} class="">
            <span className="sr-only">{t("close_cart")}</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>

          <div className="w-full space-y-6">
            <div className="space-y-4">
              {items?.length === 0 ? (
                <EmptyCart />
              ) : (
                <>
                  {items &&
                    items?.map((item) => (
                      <>
                        <div key={item.id} className="flex items-center gap-4">
                          <EventProduct item={item} />
                        </div>
                      </>
                    ))}
                </>
              )}
            </div>

            {items?.length > 0 && (
              <div className="space-y-4 text-center">
                <Button
                  onClick={() => {
                    handleCheckout();
                  }}
                  class="hover block  w-full rounded px-5 py-3 text-sm transition"
                  primary
                >
                  {t("checkout")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

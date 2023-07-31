import EventProduct from "./EventProduct";
import EmptyCart from "../../cart/shopping_basket/EmptyCart";
import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/common";
import { useEventCart } from "../../../../components/Context/EventCartContext";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { IProductPackCartItem } from "../../../../lib/types";

export default function EventCart() {
  const t = useTranslations();
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
    <div
      className="absolute -top-20 right-10 z-40 rounded-lg  border-2 border-beer-softBlonde bg-beer-softFoam px-4 py-8 shadow-md sm:px-6 lg:px-8"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      {isMinimized ? (
        <>
          <Button
            class="end-4 absolute top-4 text-gray-600 transition hover:scale-110"
            onClick={() => setIsMinimized(false)}
          >
            <span className="sr-only">Open cart</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8h16M4 16h16"
              />
            </svg>
          </Button>
        </>
      ) : (
        <div className="w-screen max-w-sm ">
          <Button
            class="end-4 absolute top-4 text-gray-600 transition hover:scale-110"
            onClick={() => setIsMinimized(true)}
          >
            <span className="sr-only">{t("close_cart")}</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>

          <div className="mt-4 space-y-6">
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

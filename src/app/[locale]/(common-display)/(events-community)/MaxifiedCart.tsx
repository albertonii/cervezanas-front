import React from "react";
import EventProduct from "./EventProduct";
import EmptyCart from "../cart/shopping_basket/EmptyCart";
import { Button } from "../../components/common/Button";
import { useTranslations } from "next-intl";
import { IProductPackCartItem } from "../../../../lib/types";

interface Props {
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  items: IProductPackCartItem[];
  handleCheckout: () => void;
}

export default function MaxifiedCart({
  setIsMinimized,
  items,
  handleCheckout,
}: Props) {
  const t = useTranslations();

  return (
    <div
      className={`relative flex w-screen max-w-sm flex-col items-center transition-all`}
    >
      <h1 className="text-xl font-medium text-gray-900">
        {t("shopping_cart")}
      </h1>

      <Button
        onClick={() => setIsMinimized(true)}
        class="absolute right-0 top-0"
      >
        <span className="sr-only">{t("close_cart")}</span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>

      <section className="w-full space-y-6">
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
      </section>
    </div>
  );
}

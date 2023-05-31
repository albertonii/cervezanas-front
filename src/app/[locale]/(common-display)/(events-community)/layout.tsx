"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Button,
  DecreaseButton,
  DeleteButton,
  IncreaseButton,
} from "../../../../components/common";
import { useEventCartContext } from "../../../../components/Context/EventCartContext";
import { COMMON } from "../../../../constants";
import EmptyCart from "../../cart/shopping_basket/EmptyCart";

type LayoutProps = {
  children: React.ReactNode;
};

export default function layout({ children }: LayoutProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [isMinimized, setIsMinimized] = React.useState<boolean>(false);
  const {
    marketplaceEventItems,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeMarketplaceItems,
    removeFromCart,
  } = useEventCartContext();

  const handleDecreaseFromCartItem = (id: string) => {
    decreaseCartQuantity(id);
    if (getItemQuantity(id) > 1) return;
    removeMarketplaceItems(id);
  };

  const handleIncreaseToCartItem = (id: string) => {
    increaseCartQuantity(id);
  };

  const handleRemoveFromCart = (id: string) => {
    removeMarketplaceItems(id);
    removeFromCart(id);
  };

  const handleCheckout = () => {
    router.push(`/${locale}/cart/event_basket`);
  };

  return (
    <>
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
              <ul className="space-y-4">
                {marketplaceEventItems?.length === 0 ? (
                  <EmptyCart />
                ) : (
                  <>
                    {marketplaceEventItems?.map((item) => (
                      <>
                        <li className="flex items-center gap-4">
                          <Image
                            src={
                              item.product_multimedia[0]
                                ? item.product_multimedia[0].p_principal
                                : COMMON.MARKETPLACE_PRODUCT
                            }
                            width={64}
                            height={64}
                            alt="Thumbnail"
                            className="h-16 w-16 rounded object-cover"
                          />

                          <div>
                            <h3 className="text-sm text-gray-900">
                              {item.name}
                            </h3>

                            <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                              <div>
                                <dt className="inline">Size:</dt>
                                <dd className="inline">XXS</dd>
                              </div>

                              <div>
                                <dt className="inline">Color:</dt>
                                <dd className="inline">White</dd>
                              </div>
                            </dl>
                          </div>

                          <div className="flex flex-1 items-center justify-end gap-2">
                            <div className="flex space-x-2">
                              <DecreaseButton
                                onClick={() =>
                                  handleDecreaseFromCartItem(item.id)
                                }
                              />

                              <span className="px-2 text-3xl text-black">
                                {getItemQuantity(item.id)}
                              </span>

                              <IncreaseButton
                                onClick={() =>
                                  handleIncreaseToCartItem(item.id)
                                }
                              />

                              <DeleteButton
                                onClick={() => {
                                  handleRemoveFromCart(item.id);
                                }}
                              />
                            </div>
                          </div>
                        </li>
                      </>
                    ))}
                  </>
                )}
              </ul>

              {marketplaceEventItems?.length > 0 && (
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

      {children}
    </>
  );
}

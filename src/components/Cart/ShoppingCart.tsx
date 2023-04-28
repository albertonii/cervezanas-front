import Link from "next/link";
import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useShoppingCart } from "../Context/ShoppingCartContext";
import { CartItem } from "./CartItem";
import { formatCurrency } from "../../utils/formatCurrency";
import { useTranslation } from "react-i18next";

type ShoppingCartProps = {
  isOpen: boolean;
};

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
  const { t } = useTranslation();
  const { items, closeCart, marketplaceItems } = useShoppingCart();

  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    let total = 0;

    marketplaceItems?.find((product) =>
      items.find((item) => {
        if (product.id === item.id) {
          total += product.price * item.quantity;
        }
      })
    );
    setSubTotal(total);

    () => {
      setSubTotal(0);
    };
  }, [items, marketplaceItems]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40"
        onClose={() => {
          closeCart();
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {t("shopping_cart")}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => {
                              closeCart();
                            }}
                          >
                            <span className="sr-only">{t("close")}</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {items &&
                              items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <CartItem
                                    key={item.id}
                                    {...item}
                                    products={marketplaceItems}
                                  />
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>{t("subtotal")}</p>

                        <p className="text-xl">{formatCurrency(subTotal)}</p>
                      </div>

                      <p className="mt-0.5 text-sm text-gray-500">
                        {t("shipping_and_taxes_calculated_at_checkout")}
                      </p>

                      <div className="mt-6">
                        <Link
                          href={{
                            pathname: "/cart/shopping_basket",
                            query: { items: JSON.stringify(items) },
                          }}
                          onClick={() => {
                            closeCart();
                          }}
                          className="flex items-center justify-center rounded-md border border-transparent bg-beer-blonde px-6 py-3 text-xl font-medium text-white shadow-sm transition-all hover:bg-beer-dark hover:text-beer-blonde"
                        >
                          {t("checkout")}
                        </Link>
                      </div>

                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          {t("or")} &nbsp;
                          <button
                            type="button"
                            className="font-medium text-beer-draft hover:text-beer-dark"
                            onClick={() => {
                              closeCart();
                            }}
                          >
                            {t("continue_shopping")}
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import {
  faCircleExclamation,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

export default function EmptyCart() {
  const t = useTranslations();
  return (
    <div className="container mt-6">
      {/* Cart Empty Icon */}
      <div className="flex flex-row items-center justify-center">
        <div className="mt-4 flex w-1/2 flex-col items-start justify-between">
          <h2 className="text-md text-gray-500 md:text-2xl">
            {t("your_empty_cart")}
          </h2>

          <div className="flex flex-col items-start justify-start space-y-2">
            <div className="text-sm text-gray-500 sm:text-xl">
              {t("add_products_to_continue")}
            </div>
          </div>
        </div>

        <FontAwesomeIcon
          icon={faShoppingCart}
          style={{ color: "#432a14", height: "4vh" }}
          title={t("empty_cart") ?? "empty_cart"}
          width={120}
          height={120}
        />
        <FontAwesomeIcon
          icon={faCircleExclamation}
          style={{ color: "#fdc300", height: "4vh" }}
          title={"circle_warning"}
          width={120}
          height={120}
        />
      </div>
    </div>
  );
}

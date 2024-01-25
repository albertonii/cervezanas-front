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
    <section className="container mt-6">
      {/* Cart Empty Icon */}
      <div className="flex flex-col items-center justify-center pb-4">
        <div className="mb-4">
          <FontAwesomeIcon
            icon={faShoppingCart}
            style={{ color: "#432a14", height: "40px" }}
            title={t("empty_cart") ?? "empty_cart"}
            width={80}
            height={80}
          />

          <FontAwesomeIcon
            icon={faCircleExclamation}
            style={{ color: "#fdc300", height: "40px" }}
            title={"circle_warning"}
            width={80}
            height={80}
          />
        </div>
        <h2 className="text-xl font-semibold uppercase text-black">
          {t("your_empty_cart")}
        </h2>

        <div className="mt-4 items-center">
          <div className="flex flex-col items-start justify-start space-y-2">
            <div className="text-base text-black">
              {t("add_products_to_continue")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

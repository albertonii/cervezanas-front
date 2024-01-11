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
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl text-gray-500">{t("your_empty_cart")}</h2>

        <div className="mt-4 flex items-center">
          <div className="flex flex-col items-start justify-start space-y-2">
            <div className="text-xl text-gray-500">
              {t("add_products_to_continue")}
            </div>
          </div>

          <div>
            <FontAwesomeIcon
              icon={faShoppingCart}
              style={{ color: "#432a14", height: "4vh" }}
              title={t("empty_cart") ?? "empty_cart"}
              width={80}
              height={80}
            />

            <FontAwesomeIcon
              icon={faCircleExclamation}
              style={{ color: "#fdc300", height: "4vh" }}
              title={"circle_warning"}
              width={80}
              height={80}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

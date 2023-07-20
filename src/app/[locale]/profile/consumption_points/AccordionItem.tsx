import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IProduct, IProductPack } from "../../../../lib/types";
import { useAuth } from "../../../../components/Auth";
import { Format, FormatName } from "../../../../lib/beerEnum";
import Image from "next/image";
import { formatCurrency } from "../../../../utils";

interface Props {
  product: IProduct;
}

const AccordionItem: React.FC<Props> = ({ product }) => {
  const t = useTranslations();
  const { user } = useAuth();

  const [showAccordion, setShowAccordion] = useState(false);

  const formatName = product.beers[0]?.format ?? "";
  const formatIcon =
    formatName === FormatName.bottle
      ? "/icons/format/bottle.svg"
      : formatName === FormatName.can
      ? "/icons/format/can.png"
      : formatName === FormatName.draft
      ? "/icons/format/keg.svg"
      : "/icons/format/bottle.svg";
  const volume = product.beers[0]?.volume ?? "";

  const [selectedPacks, setSelectedPacks] = useState<{
    [productId: string]: string[];
  }>({});

  const handleCheckboxChange = (
    productId: string,
    packId: string,
    isChecked: boolean
  ) => {
    setSelectedPacks((prevSelectedPacks) => ({
      ...prevSelectedPacks,
      [productId]: isChecked
        ? [...(prevSelectedPacks[productId] || []), packId]
        : (prevSelectedPacks[productId] || []).filter((id) => id !== packId),
    }));
  };

  if (!user) {
    return <div>Please login to see products.</div>;
  }

  return (
    <div className="mx-4 my-2 rounded-lg border border-gray-200">
      <div
        className={`${
          showAccordion ? "bg-gray-100 text-beer-draft" : "text-beer-gold"
        } flex cursor-pointer justify-between px-6 py-4 text-lg `}
        onClick={() => setShowAccordion(!showAccordion)}
      >
        <span className="mr-2 font-semibold">{product.name}</span>

        <div className="flex space-x-2">
          <span className="">
            {volume} {formatName === Format.draft.toString() ? "l" : "ml"}
          </span>

          <Image src={formatIcon} alt="format" width={32} height={32} />
        </div>
      </div>

      {showAccordion && (
        <div className="px-6 py-4">
          <div className="mb-2 text-gray-500 dark:text-gray-400">
            {t("brand_header")}: [Marca del producto]
          </div>
          <div className="mb-2 text-gray-500 dark:text-gray-400">
            {t("format_header")}: {t(formatName ?? "")}
          </div>
          <div className="mb-4 text-gray-500 dark:text-gray-400">
            {t("capacity_header")}: {volume ?? ""}
            {formatName === Format.draft.toString() ? "l" : "ml"}
          </div>

          {user && (
            <>
              <span className="mb-4 text-lg font-semibold">
                {" "}
                {t("available_packs")}:
              </span>

              <div className="grid grid-cols-1 space-y-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {product.product_packs
                  .sort((a, b) => a.quantity - b.quantity)
                  .map((pack: IProductPack) => (
                    <div
                      key={pack.id}
                      className={`${
                        selectedPacks[product.id]?.includes(pack.id) &&
                        "bg-beer-softFoam"
                      } mr-2 flex items-center rounded-lg border p-1`}
                    >
                      <input
                        id={`checkbox-pack-${pack.id}`}
                        type="checkbox"
                        checked={selectedPacks[product.id]?.includes(pack.id)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            product.id,
                            pack.id,
                            e.target.checked
                          )
                        }
                        className={`h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft`}
                      />
                      <div>
                        <label
                          htmlFor={`checkbox-pack-${pack.id}`}
                          className="ml-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {pack.name}
                        </label>

                        <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {pack.quantity}{" "}
                          {pack.quantity > 1 ? t("units") : t("unit")} {" - "}
                          {formatCurrency(pack.price)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccordionItem;

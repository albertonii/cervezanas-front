import Image from "next/image";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IProduct, IRefProductPack } from "../../../../../../lib/types.d";
import { Format, FormatName } from "../../../../../../lib/beerEnum";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UseFormReturn } from "react-hook-form";
import { formatCurrency } from "../../../../../../utils/formatCurrency";

interface Props {
  product: IProduct;
  form: UseFormReturn<any, any>;
  productItems?: string[];
}

const AccordionItem: React.FC<Props> = ({ product, form, productItems }) => {
  const t = useTranslations();
  const { register } = form;

  const [selectedPacks, setSelectedPacks] = useState(productItems);

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

  const handleCheckboxChange = (packId: string, isChecked: boolean) => {
    setSelectedPacks((prevSelectedPacks) => {
      if (isChecked) {
        return [...(prevSelectedPacks || []), packId];
      } else {
        return (prevSelectedPacks || []).filter((id) => id !== packId);
      }
    });

    // setValue(`product_items.${product.id}.id`, selectedPacks);
  };

  return (
    <div className="mx-4 my-2 rounded-lg border border-gray-200 pb-4">
      <div
        className={`${
          showAccordion ? "bg-gray-100 text-beer-draft" : "text-beer-gold"
        } flex cursor-pointer justify-between px-6 py-4 text-lg `}
        onClick={() => setShowAccordion(!showAccordion)}
      >
        <div className="flex items-center justify-center space-x-2">
          <FontAwesomeIcon
            icon={faChevronCircleDown}
            style={{ color: showAccordion ? "#90470b" : "#EE9900" }}
            title={"chevron_circle_down"}
            width={20}
            height={20}
            className={`${showAccordion && "rotate-180"}`}
          />
          <span className="mr-2 font-semibold">{product.name}</span>
        </div>

        <div className="flex space-x-2">
          <span className="">
            {volume} {formatName === Format.draft.toString() ? "l" : "ml"}
          </span>

          <Image src={formatIcon} alt="format" width={32} height={32} />
        </div>
      </div>

      <div
        className={`px-6 pt-4 ${
          showAccordion ? "max-h-[1000px]" : "max-h-0"
        } duration-800 overflow-hidden transition-all ease-in-out`}
      >
        <div className={`flex justify-between`}>
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
        </div>

        <div className={``}>
          <span className="mb-4 text-lg font-semibold">
            {t("available_packs")}:
          </span>

          <div className="grid grid-cols-1 space-y-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {product.product_packs
              .sort((a, b) => a.quantity - b.quantity)
              .map((pack: IRefProductPack) => (
                <div
                  key={pack.id}
                  className={`${
                    selectedPacks?.includes(pack.id) && "bg-beer-softFoam"
                  } mr-2 flex items-center space-x-2 rounded-lg border p-1`}
                >
                  <input
                    id={`checkbox-pack-${pack.id}`}
                    type="checkbox"
                    {...register(`product_items.${product.id}.id`)}
                    checked={selectedPacks?.includes(pack.id)}
                    onChange={(e) =>
                      handleCheckboxChange(pack.id, e.target.checked)
                    }
                    value={pack.id}
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
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;

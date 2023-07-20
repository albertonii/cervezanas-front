import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IProduct, IProductPack } from "../../../../lib/types";
import { useAuth } from "../../../../components/Auth";
import { Format, FormatName } from "../../../../lib/beerEnum";
import Image from "next/image";

interface Props {
  product: IProduct;
}

const AccordionItem: React.FC<Props> = ({ product }) => {
  const t = useTranslations();
  const { user } = useAuth();

  const [showAccordion, setShowAccordion] = useState(false);
  const [formatIcon, setFormatIcon] = useState(() => {
    const format = product.beers[0]?.format;
    switch (format) {
      case FormatName.bottle:
        return "/icons/format/bottle.svg";
      case FormatName.can:
        return "/icons/format/can.png";
      case FormatName.draft:
        return "/icons/format/keg.svg";
      default:
        return "/icons/format/bottle.svg";
    }
  });

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
    <div className="mb-4 rounded-lg border border-gray-200">
      <div
        className={`${
          showAccordion
            ? "bg-gray-100 text-beer-draft"
            : "bg-white text-beer-gold"
        } flex cursor-pointer justify-between px-6 py-4 text-lg font-semibold`}
        onClick={() => setShowAccordion(!showAccordion)}
      >
        <span className="mr-2">{product.name}</span>

        <Image src={formatIcon} alt="format" width={32} height={32} />
      </div>

      {showAccordion && (
        <div className="bg-white px-6 py-4">
          <div className="mb-2 text-gray-500 dark:text-gray-400">
            {t("brand_header")}: [Marca del producto]
          </div>
          <div className="mb-2 text-gray-500 dark:text-gray-400">
            {t("format_header")}: {t(product.beers[0]?.format ?? "")}
          </div>
          <div className="mb-4 text-gray-500 dark:text-gray-400">
            {t("capacity_header")}: {t(product.beers[0]?.volume ?? "")}{" "}
            {product.beers[0]?.format === Format.draft.toString() ? "l" : "ml"}
          </div>
          {user && (
            <div>
              {product.product_packs
                .sort((a, b) => a.quantity - b.quantity)
                .map((pack: IProductPack) => (
                  <div key={pack.id} className="mb-2 flex items-center">
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
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                    />
                    <label
                      htmlFor={`checkbox-pack-${pack.id}`}
                      className="ml-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {pack.name}
                    </label>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccordionItem;

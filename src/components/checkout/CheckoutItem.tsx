import { Button } from "@supabase/ui";
import Image from "next/image";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SupabaseProps } from "../../constants";
import { Beer } from "../../lib/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { supabase } from "../../utils/supabaseClient";

interface Props {
  beer: Beer;
  handleIncreaseCartQuantity: (id: string) => void;
  handleDecreaseCartQuantity: (id: string) => void;
  handleRemoveFromCart: (id: string) => void;
  quantity: number;
}

export default function CheckoutItem({
  beer,
  handleIncreaseCartQuantity,
  handleDecreaseCartQuantity,
  handleRemoveFromCart,
  quantity,
}: Props) {
  const { t } = useTranslation();

  const [p_principal, setPPrincipal] = useState<string>("");
  const [productSubtotal, setProductSubtotal] = useState<number>(
    beer.price * quantity
  );

  useEffect(() => {
    const getPrincipal = async () => {
      const hasPrincipal = beer.product_multimedia[0].p_principal
        ? true
        : false;

      console.log(hasPrincipal);
      if (hasPrincipal) {
        const pPrincipalUrl = `${SupabaseProps.P_PRINCIPAL_URL}${beer.owner_id}/${beer.product_multimedia[0].p_principal}`;
        const { data: p_principal, error } = supabase.storage
          .from("products")
          .getPublicUrl(pPrincipalUrl);

        if (error) throw error;
        setPPrincipal(p_principal!.publicURL);
      } else {
        const pPrincipalUrl = "/marketplace_product_default.png";
        setPPrincipal(pPrincipalUrl);
      }

      // const pPrincipalUrl = `${beer.product_multimedia[0].p_principal} ?
      //  ${SupabaseProps.P_PRINCIPAL_URL}${beer.owner_id}/${beer.product_multimedia[0].p_principal}
      //  : "/marketplace_product_default.png"`;
    };

    getPrincipal();
    setProductSubtotal(beer.price * quantity);
  }, [beer.owner_id, beer.price, beer.product_multimedia, quantity]);

  return (
    <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
      <div className="pb-4 md:pb-8 w-full md:w-40">
        <Image
          width={600}
          height={600}
          className="w-full hidden md:block"
          src={p_principal}
          alt={beer.name}
        />
        <Image
          width={300}
          height={300}
          className="w-full md:hidden"
          src={p_principal}
          alt={beer.name}
        />
      </div>

      <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
        <div className="w-full flex flex-col justify-start items-start space-y-8">
          <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
            {beer.name}
          </h3>
          <div className="flex justify-start items-start flex-col space-y-2">
            <p className="text-sm dark:text-white leading-none text-gray-800">
              <span className="dark:text-gray-400 text-gray-300">Style: </span>{" "}
              Italic Minimal Design
            </p>
            <p className="text-sm dark:text-white leading-none text-gray-800">
              <span className="dark:text-gray-400 text-gray-300">Size: </span>{" "}
              Small
            </p>
            <p className="text-sm dark:text-white leading-none text-gray-800">
              <span className="dark:text-gray-400 text-gray-300">Color: </span>{" "}
              Light Blue
            </p>
          </div>
        </div>
        <div className="flex justify-between space-x-8 items-start w-full">
          <p className="text-base dark:text-white xl:text-lg leading-6">
            {formatCurrency(beer.price)}
            <span className="text-red-300 line-through"> $45.00</span>
          </p>
          <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">
            {quantity === 0 ? (
              <></>
            ) : (
              <div>
                <div className="flex items-center justify-center">
                  <Button onClick={() => handleDecreaseCartQuantity(beer.id)}>
                    -
                  </Button>
                  <span className="px-2 text-3xl text-black">{quantity}</span>
                  <Button onClick={() => handleIncreaseCartQuantity(beer.id)}>
                    +
                  </Button>
                </div>
              </div>
            )}
          </p>
          <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">
            {formatCurrency(productSubtotal)}
          </p>

          <span>
            <Button
              className={"bg-red-200"}
              onClick={() => {
                handleRemoveFromCart(beer.id);
              }}
            >
              {t("remove")}
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
}

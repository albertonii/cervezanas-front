import _ from "lodash";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { product_type_options, BeerEnum } from "../../lib/beerEnum";
import { supabase } from "../../utils/supabaseClient";
import {
  Product,
  Inventory,
  ModalUpdateProductProps,
  Award,
} from "../../lib/types";
import { useAuth } from "../Auth";
import { Modal, ProductStepper } from ".";
import { ProductInfoSectionUpdate } from "./ProductInfoSectionUpdate";
import { AwardsSectionUpdate } from "./AwardsSectionUpdate";
import { MultimediaSectionUpdate } from "./MultimediaSectionUpdate";

interface Props {
  product: Product;
  handleSetProducts: Dispatch<SetStateAction<any>>;
  handleEditShowModal: Dispatch<SetStateAction<any>>;
}

export function UpdateProduct({
  product,
  handleSetProducts,
  handleEditShowModal,
}: Props) {
  const { t } = useTranslation();

  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);

  const handleSetActiveStep = (value: number) => {
    setActiveStep(value);
  };

  const form = useForm<ModalUpdateProductProps>({
    mode: "onSubmit",
    defaultValues: {
      name: product.name || "",
      description: product.description || "",
      type: product.type || "",
      is_public: product.is_public || false,
      price: product.price || 0,
      stock_quantity: product.product_inventory[0]?.quantity || 0,
      stock_limit_notification:
        product.product_inventory[0]?.limit_notification || 0,
      campaign: "-" || "",
      pack: product.beers[0]?.pack || "",
      format: product.beers[0]?.format || "",
      volume: product.beers[0]?.volume || 0,
      color: product.beers[0]?.color || "",
      intensity: product.beers[0]?.intensity || "",
      family: product.beers[0]?.family || "",
      fermentation: product.beers[0]?.fermentation || "",
      origin: product.beers[0]?.origin || "",
      era: product.beers[0]?.era || "",
      is_gluten: product.beers[0]?.is_gluten || false,
      awards: [{ name: "", description: "", year: 0, img_url: "" }],
    },
  });

  const {
    formState: { errors },
    handleSubmit,
    reset,
  } = form;

  const onSubmit = (formValues: ModalUpdateProductProps) => {
    const handleProductInsert = async () => {
      handleEditShowModal(false);

      const {
        campaign,
        fermentation,
        color,
        intensity,
        aroma,
        family,
        origin,
        era,
        is_gluten,
        type,
        awards,
        p_principal,
        p_back,
        p_extra_1,
        p_extra_2,
        p_extra_3,
        is_public,
        name,
        description,
        price,
        volume,
        pack,
        format,
        stock_quantity,
        stock_limit_notification,
      } = formValues;

      const userId = user?.id;

      const { data: product_upd, error: productError } = await supabase
        .from("products")
        .update({
          name: name,
          description: description,
          type,
          owner_id: userId,
          price,
          is_public: is_public,
        })
        .eq("id", product.id)
        .select();

      if (productError) throw productError;

      const productId = product.id;

      // Multimedia

      // URL = /articles/[n_articulo]/[n_variante]/[n_aleatorio]-[nombre-articulo.jgp]
      // TODO: PHOTO PRINCIPAL = /articles/[n_articulo]/[n_variante]/[n_aleatorio]-[nombre-articulo.jgp]
      // const p_principal_url = !_.isEmpty(p_principal?.name)
      //   ? encodeURIComponent(
      //       `/articles/[n_articulo]/[n_variante]/[n_aleatorio]-` +
      //         p_principal.name
      //     )
      //   : null;

      const p_principal_url = !_.isEmpty(p_principal?.name)
        ? encodeURIComponent(p_principal.name)
        : null;

      const p_back_url = !_.isEmpty(p_back?.name)
        ? encodeURIComponent(p_back.name)
        : null;

      const p_extra_1_url = !_.isEmpty(p_extra_1?.name)
        ? encodeURIComponent(p_extra_1.name)
        : null;

      const p_extra_2_url = !_.isEmpty(p_extra_2?.name)
        ? encodeURIComponent(p_extra_2.name)
        : null;

      const p_extra_3_url = !_.isEmpty(p_extra_3?.name)
        ? encodeURIComponent(p_extra_3.name)
        : null;

      const { data: product_multimedia, error: multError } = await supabase
        .from("product_multimedia")
        .update({
          p_principal: p_principal_url,
          p_back: p_back_url,
          p_extra_1: p_extra_1_url,
          p_extra_2: p_extra_2_url,
          p_extra_3: p_extra_3_url,
        })
        .eq("product_id", product.id);

      if (multError) throw multError;
      product_upd[0].product_multimedia = product_multimedia;

      if (p_principal_url) {
        const { error: pPrincipalError } = await supabase.storage
          .from("products")
          .upload(
            `p_principal/${userId}/${p_principal_url}`,
            p_principal.name,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
        if (pPrincipalError) throw pPrincipalError;
      }

      if (p_back_url) {
        const { error: pBackError } = await supabase.storage
          .from("products")
          .update(`p_back/${userId}/${p_back_url}`, p_back.name, {
            cacheControl: "3600",
            upsert: false,
          });
        if (pBackError) throw pBackError;
      }

      if (p_extra_1_url) {
        const { error: pExtra1Error } = await supabase.storage
          .from("products")
          .update(`p_extra_1/${userId}/${p_extra_1_url}`, p_extra_1.name, {
            cacheControl: "3600",
            upsert: false,
          });
        if (pExtra1Error) throw pExtra1Error;
      }

      if (p_extra_2_url) {
        const { error: pExtra2Error } = await supabase.storage
          .from("products")
          .update(`p_extra_2/${userId}/${p_extra_2_url}`, p_extra_2.name, {
            cacheControl: "3600",
            upsert: false,
          });
        if (pExtra2Error) throw pExtra2Error;
      }

      if (p_extra_3_url) {
        const { error: pExtra3Error } = await supabase.storage
          .from("products")
          .update(`p_extra_3/${userId}/${p_extra_3_url}`, p_extra_3.name, {
            cacheControl: "3600",
            upsert: false,
          });
        if (pExtra3Error) throw pExtra3Error;
      }
      setActiveStep(0);

      if (product_type_options[0].label === BeerEnum.Product_type.beer) {
        const { data: beerData, error: beerError } = await supabase
          .from("beers")
          .update({
            intensity: intensity,
            fermentation: fermentation,
            color: color,
            aroma: aroma,
            family: family,
            origin: origin,
            era: era,
            is_gluten,
            volume,
            pack,
            format,
            product_id: productId,
          })
          .eq("product_id", product.id);

        if (beerError) throw beerError;
        product_upd[0].beers = beerData;

        const beer = beerData[0];
        const beerId = beer.id;

        // Inventory - Stock
        const stock: Inventory = {
          product_id: productId,
          quantity: stock_quantity,
          limit_notification: stock_limit_notification,
        };

        const { data: product_inventory, error: stockError } = await supabase
          .from("product_inventory")
          .update(stock)
          .eq("product_id", product.id);

        if (stockError) throw stockError;

        product_upd[0].product_inventory = product_inventory;

        // Awards
        if (awards!.length > 0 && awards![0].img_url != "") {
          awards!.map(async (award: Award) => {
            if (award.img_url.length > 0) {
              const file = award.img_url[0];
              const productFileUrl = encodeURIComponent(file.name);
              const { data: awards, error: awardsError } = await supabase
                .from("awards")
                .update({
                  product_id: beerId,
                  name: award.name,
                  description: award.description,
                  year: award.year,
                  img_url: productFileUrl,
                })
                .eq("product_id", product.id);

              if (awardsError) throw awardsError;

              product_upd[0].awards = awards[0];

              const { error: storageAwardsError } = await supabase.storage
                .from("products")
                .upload(`awards/${productFileUrl}`, file, {
                  cacheControl: "3600",
                  upsert: false,
                });

              if (storageAwardsError) throw storageAwardsError;
            }
          });
        }

        // Update previous product list
        handleSetProducts((prev: any) => {
          const index = prev.findIndex((p: any) => p.id === product_upd[0].id);
          prev[index] = product_upd[0];
          return [...prev];
        });

        return product;
      }

      reset();
    };
    handleProductInsert();
  };

  return (
    <form className="w-full">
      <Modal
        showBtn={false}
        isVisible={true}
        title={"save_product"}
        btnTitle={"save_product"}
        description={""}
        handler={handleSubmit(onSubmit)}
        handlerClose={() => handleEditShowModal(false)}
        classIcon={""}
        classContainer={""}
      >
        <>
          <ProductStepper
            activeStep={activeStep}
            handleSetActiveStep={handleSetActiveStep}
          >
            <>
              <p className="my-4 text-slate-500 text-lg leading-relaxed">
                {t("modal_product_description")}
              </p>

              {activeStep === 0 ? (
                <>
                  <ProductInfoSectionUpdate form={form} />
                </>
              ) : activeStep === 1 ? (
                <>
                  <AwardsSectionUpdate form={form} />
                </>
              ) : activeStep === 2 ? (
                <>
                  <MultimediaSectionUpdate form={form} />
                </>
              ) : (
                <></>
              )}
            </>
          </ProductStepper>
        </>
      </Modal>
    </form>
  );
}

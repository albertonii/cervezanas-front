"use client";

import _ from "lodash";
import React, { ComponentProps, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  fermentation_options,
  product_type_options,
} from "../../../../lib/beerEnum";
import {
  IProduct,
  IInventory,
  IAward,
  ModalUpdateProductProps,
  IProductPack,
} from "../../../../lib/types.d";
import { uuid } from "uuidv4";
import { Modal } from "./Modal";
import { useAuth } from "../../Auth/useAuth";
import { ProductStepper } from "./ProductStepper";
import { useMutation, useQueryClient } from "react-query";
import { AwardsSectionUpdate } from "./AwardsSectionUpdate";
import { useSupabase } from "../../../../context/SupabaseProvider";
import { MultimediaSectionUpdate } from "./MultimediaSectionUpdate";
import { ProductInfoSectionUpdate } from "./ProductInfoSectionUpdate";
import { getFileExtensionByName } from "../../../../utils/formatWords";
import { isNotEmptyArray, isValidObject } from "../../../../utils/utils";

interface Props {
  product: IProduct;
  showModal: boolean;
  handleEditShowModal: ComponentProps<any>;
}

export function UpdateProduct({
  product,
  showModal,
  handleEditShowModal,
}: Props) {
  const t = useTranslations();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

  const handleSetActiveStep = (value: number) => {
    setActiveStep(value);
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { supabase } = useSupabase();

  const form = useForm<ModalUpdateProductProps>({
    mode: "onSubmit",
    defaultValues: {
      name: product.name ?? "",
      description: product.description ?? "",
      type: product.type ?? "",
      is_public: product.is_public ?? false,
      price: product.price ?? 0,
      stock_quantity: product.product_inventory![0].quantity ?? 0,
      stock_limit_notification:
        product.product_inventory![0].limit_notification ?? 0,
      campaign: "-" ?? "",
      format: product.beers[0]?.format ?? "",
      volume: product.beers[0]?.volume ?? 0,
      color: product.beers[0]?.color,
      aroma: product.beers[0]?.aroma,
      intensity: product.beers[0]?.intensity,
      family: product.beers[0]?.family ?? "",
      fermentation: fermentation_options[0].label,
      origin: product.beers[0]?.origin ?? "",
      era: product.beers[0]?.era ?? "",
      is_gluten: product.beers[0]?.is_gluten ?? false,
      awards: [{ name: "", description: "", year: 0, img_url: "" }],
      packs: product.product_packs,
    },
  });

  const { handleSubmit, reset } = form;
  const queryClient = useQueryClient();

  const handleUpdateProduct = async (formValues: any) => {
    const {
      // campaign,
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
      format,
      stock_quantity,
      stock_limit_notification,
      packs,
    } = formValues;

    const userId = user?.id;

    const { data, error: productError } = await supabase
      .from("products")
      .update({
        name,
        description,
        type,
        owner_id: userId,
        price,
        is_public,
      })
      .eq("id", product.id)
      .select();

    if (productError) throw productError;
    if (!data) throw new Error("No data returned from supabase");

    const productData = data[0] as IProduct;

    const productId = product.id;

    // Multimedia
    const p_principal_url = !_.isEmpty(p_principal?.name)
      ? encodeURIComponent(p_principal.name)
      : "";

    const p_back_url = !_.isEmpty(p_back?.name)
      ? encodeURIComponent(p_back.name)
      : "";

    const p_extra_1_url = !_.isEmpty(p_extra_1?.name)
      ? encodeURIComponent(p_extra_1.name)
      : "";

    const p_extra_2_url = !_.isEmpty(p_extra_2?.name)
      ? encodeURIComponent(p_extra_2.name)
      : "";

    const p_extra_3_url = !_.isEmpty(p_extra_3?.name)
      ? encodeURIComponent(p_extra_3.name)
      : "";

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
    if (product_multimedia) {
      productData.product_multimedia = product_multimedia;
    }

    // Store images in bucket
    if (p_principal_url) {
      const { error: pPrincipalError } = await supabase.storage
        .from("products")
        .update(`articles/${p_principal_url}`, p_principal, {
          cacheControl: "3600",
          upsert: true,
        });
      if (pPrincipalError) throw pPrincipalError;
    }

    if (p_back_url) {
      const { error: pBackError } = await supabase.storage
        .from("products")
        .update(`articles/${p_back_url}`, p_back.name, {
          cacheControl: "3600",
          upsert: true,
        });
      if (pBackError) throw pBackError;
    }

    if (p_extra_1_url) {
      const { error: pExtra1Error } = await supabase.storage
        .from("products")
        .update(`articles/${p_extra_1}`, p_extra_1.name, {
          cacheControl: "3600",
          upsert: true,
        });
      if (pExtra1Error) throw pExtra1Error;
    }

    if (p_extra_2_url) {
      const { error: pExtra2Error } = await supabase.storage
        .from("products")
        .update(`articles/${p_extra_2_url}`, p_extra_2.name, {
          cacheControl: "3600",
          upsert: true,
        });
      if (pExtra2Error) throw pExtra2Error;
    }

    if (p_extra_3_url) {
      const { error: pExtra3Error } = await supabase.storage
        .from("products")
        .update(`articles/${p_extra_3_url}`, p_extra_3.name, {
          cacheControl: "3600",
          upsert: true,
        });
      if (pExtra3Error) throw pExtra3Error;
    }

    setActiveStep(0);

    if (product_type_options[0].label === productData.type) {
      const { data: beerData, error: beerError } = await supabase
        .from("beers")
        .update({
          intensity,
          fermentation,
          color,
          aroma,
          family,
          origin,
          era,
          is_gluten,
          volume,
          format,
          product_id: productId,
        })
        .eq("product_id", product.id)
        .select();

      if (beerError) throw beerError;
      // productData.beers = beerData;

      const beer = beerData[0];
      const beerId = beer.id;

      // Inventory - Stock
      const stock: IInventory = {
        product_id: productId,
        quantity: stock_quantity,
        limit_notification: stock_limit_notification,
      };

      const { data: product_inventory, error: stockError } = await supabase
        .from("product_inventory")
        .update(stock)
        .eq("product_id", product.id);
      if (stockError) throw stockError;

      if (product_inventory) {
        productData.product_inventory = product_inventory;
      }

      // Packs
      if (packs.length > 0) {
        packs.map(async (pack: IProductPack) => {
          pack.randomUUID = isValidObject(pack.randomUUID)
            ? pack.randomUUID
            : uuid();

          const { error: packsError } = await supabase
            .from("product_packs")
            .upsert({
              product_id: productId,
              quantity: pack.quantity,
              price: pack.price,
              name: pack.name,
              img_url: pack.img_url.name,
              randomUUID: pack.randomUUID,
            })
            .eq("product_id", product.id);

          if (packsError) throw packsError;

          // Upd Img to Store
          // check if image selected in file input is not empty and is an image
          if (pack.img_url) {
            const { error: storagePacksError } = await supabase.storage
              .from("products")
              .upload(
                `articles/${productId}/packs/${
                  pack.randomUUID
                }.${getFileExtensionByName(pack.img_url.name)}`,
                pack.img_url,
                {
                  cacheControl: "3600",
                  upsert: true,
                }
              );

            if (storagePacksError) throw storagePacksError;
          }
        });

        productData.product_packs = packs;
      }

      // Awards
      if (
        awards &&
        isNotEmptyArray(awards) &&
        isValidObject(awards[0].img_url)
      ) {
        awards.map(async (award: IAward) => {
          if (award.img_url.length > 0) {
            const file = award.img_url[0];
            const productFileUrl = encodeURIComponent(file.name);
            const { data, error: awardsError } = await supabase
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
            if (!data) throw new Error("No data returned from awards update");

            const awards = data as IAward[];
            productData.awards = awards;

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
    }
  };

  const updateProductMutation = useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: handleUpdateProduct,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      handleEditShowModal(false);
      setIsSubmitting(false);
      reset();
    },
    onError: (error: any) => {
      console.error(error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (formValues: ModalUpdateProductProps) => {
    try {
      updateProductMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }

    handleEditShowModal(false);
  };

  return (
    <form className="w-full">
      <Modal
        showBtn={false}
        showModal={showModal}
        setShowModal={handleEditShowModal}
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
            isSubmitting={isSubmitting}
          >
            <>
              <p className="text-slate-500 my-4 text-lg leading-relaxed">
                {t("modal_product_description")}
              </p>

              {activeStep === 0 ? (
                <>
                  <ProductInfoSectionUpdate form={form} />
                </>
              ) : activeStep === 1 ? (
                <>
                  <MultimediaSectionUpdate form={form} />
                </>
              ) : activeStep === 2 ? (
                <>
                  <AwardsSectionUpdate form={form} />
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
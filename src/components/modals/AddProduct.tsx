"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  aroma_options,
  color_options,
  era_options,
  family_options,
  fermentation_options,
  origin_options,
  product_type_options,
} from "../../lib/beerEnum";
import { AwardsSection } from "./AwardsSection";
import { MultimediaSection } from "./MultimediaSection";
import {
  IAward,
  IInventory,
  IProduct,
  IProductPack,
  ModalAddProductProps,
} from "../../lib/types.d";
import { useAuth } from "../Auth";
import { Modal, ProductInfoSection, ProductStepper } from ".";
import { uuid } from "uuidv4";
import { ProductSummary } from "./ProductSummary";
import { getFileExtensionByName } from "../../utils";
import {
  generateFileName,
  isNotEmptyArray,
  isValidObject,
} from "../../utils/utils";
import { useAppContext } from "../Context";
import { useSupabase } from "../Context/SupabaseProvider";
import { useMutation, useQueryClient } from "react-query";

export function AddProduct() {
  const t = useTranslations();
  const { supabase } = useSupabase();

  const { customizeSettings, setProducts } = useAppContext();

  const { user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleSetActiveStep = (value: number) => {
    setActiveStep(value);
  };

  const form = useForm<ModalAddProductProps>({
    mode: "onSubmit",
    defaultValues: {
      awards: [],
      type: "beer",
    },
  });

  const { handleSubmit, reset } = form;
  const queryClient = useQueryClient();

  const handleProductInsert = async (formValues: any) => {
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
      category,
    } = formValues;

    const userId = user?.id;

    // Product
    // TODO: AÑADIR -> Nº ARTÍCULO, Nº VARIANTE, Nº ALEATORIO
    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert({
        name,
        description,
        type,
        owner_id: userId,
        price,
        is_public,
        category,
      })
      .select();

    if (productError) throw productError;

    const productId = productData[0].id;

    // Multimedia
    const randomUUID = uuid();

    let p_principal_url = "";
    let p_back_url = "";
    let p_extra_1_url = "";
    let p_extra_2_url = "";
    let p_extra_3_url = "";

    if (p_principal) {
      p_principal_url = encodeURIComponent(
        `/articles/${productId}/p_principal/${randomUUID}.${generateFileName(
          p_principal.name
        )}`
      );

      const { error: pPrincipalError } = await supabase.storage
        .from("products")
        .upload(
          `/articles/${productId}/p_principal/${randomUUID}.${generateFileName(
            p_principal.name
          )}`,
          p_principal,
          {
            contentType: p_principal.type,
            cacheControl: "3600",
            upsert: false,
          }
        );
      if (pPrincipalError) throw pPrincipalError;
    }

    if (p_back) {
      p_back_url =
        p_back &&
        encodeURIComponent(
          `/articles/${productId}/p_back/${randomUUID}.${p_back?.name}`
        );

      const { error: pBackError } = await supabase.storage
        .from("products")
        .upload(
          `/articles/${productId}/p_back/${randomUUID}.${p_back.name}`,
          p_back,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );
      if (pBackError) throw pBackError;
    }

    if (p_extra_1) {
      p_extra_1_url =
        p_extra_1 &&
        encodeURIComponent(
          `/articles/${productId}/p_extra_1/${randomUUID}.${p_extra_1?.name}`
        );

      const { error: pExtra1Error } = await supabase.storage
        .from("products")
        .upload(
          `/articles/${productId}/p_extra_1/${randomUUID}.${p_extra_1.name}`,
          p_extra_1,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );
      if (pExtra1Error) throw pExtra1Error;
    }

    if (p_extra_2) {
      p_extra_2_url =
        p_extra_2 &&
        encodeURIComponent(
          `/articles/${productId}/p_extra_2/${randomUUID}.${p_extra_2?.name}`
        );

      const { error: pExtra2Error } = await supabase.storage
        .from("products")
        .upload(
          `/articles/${productId}/p_extra_2/${randomUUID}.${p_extra_2.name}`,
          p_extra_2,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );
      if (pExtra2Error) throw pExtra2Error;
    }

    if (p_extra_3) {
      p_extra_3_url =
        p_extra_3 &&
        `/articles/${productId}/p_extra_3/${randomUUID}.${p_extra_3?.name}`;

      const { error: pExtra3Error } = await supabase.storage
        .from("products")
        .upload(
          `/articles/${productId}/p_extra_3/${randomUUID}.${p_extra_3.name}`,
          p_extra_3,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );
      if (pExtra3Error) throw pExtra3Error;
    }

    const { error: multError } = await supabase
      .from("product_multimedia")
      .insert({
        product_id: productId,
        p_principal: p_principal_url ?? "",
        p_back: p_back_url ?? "",
        p_extra_1: p_extra_1_url ?? "",
        p_extra_2: p_extra_2_url ?? "",
        p_extra_3: p_extra_3_url ?? "",
      });

    if (multError) throw multError;

    setActiveStep(0);

    if (product_type_options[0].label === productData[0].type) {
      const { data: beerData, error: beerError } = await supabase
        .from("beers")
        .insert({
          intensity,
          fermentation: fermentation_options[fermentation].label,
          color: color_options[color].label,
          aroma: aroma_options[aroma].label,
          family: family_options[family].label,
          origin: origin_options[origin].label,
          era: era_options[era].label,
          is_gluten,
          volume,
          format,
          product_id: productId,
        })
        .select();

      if (beerError) throw beerError;
      const beer = beerData[0];

      // UPD Beer in new product displayed in list
      productData[0].beers = beer;

      // Inventory - Stock
      const stock: IInventory = {
        product_id: productId,
        quantity: stock_quantity,
        limit_notification: stock_limit_notification,
      };

      // UPD Stock in new product displayed in list
      productData[0].product_inventory = stock;

      const { error: stockError } = await supabase
        .from("product_inventory")
        .insert(stock);
      if (stockError) throw stockError;

      // Packs Stock
      if (packs.length > 0) {
        packs.map(async (pack: IProductPack) => {
          const { error: packsError } = await supabase
            .from("product_pack")
            .insert({
              product_id: productId,
              pack: pack.pack,
              price: pack.price,
              name: pack.name,
              img_url: `articles/${productId}/packs/${randomUUID}.${getFileExtensionByName(
                pack.img_url.name
              )}`,
              randomUUID: randomUUID,
            });

          if (packsError) throw packsError;

          // Add Img to Store
          // check if image selected in file input is not empty and is an image
          if (pack.img_url) {
            // const file = pack.img_url;
            // const productFileUrl = encodeURIComponent(file.name);

            const { error: storagePacksError } = await supabase.storage
              .from("products")
              .upload(
                `articles/${productId}/packs/${randomUUID}.${getFileExtensionByName(
                  pack.img_url.name
                )}`,
                pack.img_url,
                {
                  cacheControl: "3600",
                  upsert: false,
                }
              );

            if (storagePacksError) throw storagePacksError;
          }
        });
      }

      // Awards
      if (isNotEmptyArray(awards) && isValidObject(awards[0].img_url)) {
        awards.map(async (award: IAward) => {
          if (award.img_url.length > 0) {
            const file = award.img_url[0];
            const productFileUrl = encodeURIComponent(file.name);
            const { error: awardsError } = await supabase
              .from("awards")
              .insert({
                product_id: productId,
                name: award.name,
                description: award.description,
                year: award.year,
                img_url: productFileUrl,
              });

            if (awardsError) throw awardsError;

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

      // Add new product to the list
      // const product = productData[0] as IProduct;
      // setProducts([...products, product]);

      return beer;
    }
  };

  const insertProductMutation = useMutation({
    mutationKey: ["insertProduct"],
    mutationFn: handleProductInsert,
    onSuccess: () => {
      alert("todo chachi o k");
      queryClient.invalidateQueries({ queryKey: ["productList"] });
    },
  });

  const onSubmit = (formValues: ModalAddProductProps) => {
    try {
      insertProductMutation.mutateAsync(formValues);
    } catch (e) {
      console.error(e);
    }

    // handleProductInsert(formValues);
    setShowModal(false);
    reset();
  };

  return (
    <form className="w-full">
      <Modal
        showBtn={true}
        showModal={showModal}
        setShowModal={setShowModal}
        title={"add_product"}
        btnTitle={"add_product"}
        description={""}
        handler={handleSubmit(onSubmit)}
        classIcon={""}
        classContainer={""}
      >
        <>
          <ProductStepper
            activeStep={activeStep}
            handleSetActiveStep={handleSetActiveStep}
          >
            <>
              <p className="text-slate-500 my-4 text-lg leading-relaxed">
                {t("modal_product_description")}
              </p>

              {activeStep === 0 ? (
                <ProductInfoSection
                  form={form}
                  customizeSettings={customizeSettings}
                />
              ) : activeStep === 1 ? (
                <AwardsSection form={form} />
              ) : activeStep === 2 ? (
                <MultimediaSection form={form} />
              ) : (
                <ProductSummary form={form} />
              )}
            </>
          </ProductStepper>
        </>
      </Modal>
    </form>
  );
}

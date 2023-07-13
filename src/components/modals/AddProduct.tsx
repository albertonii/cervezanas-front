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
  IProductPack,
  ModalAddProductProps,
} from "../../lib/types.d";
import { useAuth } from "../Auth";
import { Modal, ProductInfoSection, ProductStepper } from ".";
import { v4 as uuidv4 } from "uuid";
import { ProductSummary } from "./ProductSummary";
import {
  generateFileNameExtension,
  isFileEmpty,
  isNotEmptyArray,
  isValidObject,
} from "../../utils/utils";
import { useAppContext } from "../Context";
import { useSupabase } from "../Context/SupabaseProvider";
import { useMutation, useQueryClient } from "react-query";

interface IFormValues {
  fermentation: number;
  color: number;
  intensity: number;
  aroma: number;
  family: number;
  origin: number;
  era: number;
  is_gluten: boolean;
  type: string;
  awards: IAward[];
  p_principal: FileList;
  p_back: FileList;
  p_extra_1: FileList;
  p_extra_2: FileList;
  p_extra_3: FileList;
  is_public: boolean;
  name: string;
  description: string;
  price: number;
  volume: number;
  format: string;
  stock_quantity: number;
  stock_limit_notification: number;
  packs: IProductPack[];
  category: string;
}

export function AddProduct() {
  const t = useTranslations();
  const { supabase } = useSupabase();

  const { customizeSettings, removeImage } = useAppContext();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  // Genera un UUID único
  const generateUUID = () => {
    return uuidv4();
  };

  const handleInsertProduct = async (formValues: IFormValues) => {
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
    const randomUUID = generateUUID();

    let p_principal_url = "";
    let p_back_url = "";
    let p_extra_1_url = "";
    let p_extra_2_url = "";
    let p_extra_3_url = "";

    if (p_principal && !isFileEmpty(p_principal)) {
      const fileName = `articles/${productId}/p_principal/${randomUUID}`;

      // .../articles/1/p_principal/uuid.jpg
      p_principal_url = encodeURIComponent(
        `${fileName}${generateFileNameExtension(p_principal[0].name)}`
      );

      const { error: pPrincipalError } = await supabase.storage
        .from("products")
        .upload(
          `${fileName}${generateFileNameExtension(p_principal[0].name)}`,
          p_principal[0],
          {
            contentType: p_principal[0].type,
            cacheControl: "3600",
            upsert: false,
          }
        );
      if (pPrincipalError) throw pPrincipalError;

      removeImage("p_principal");
    }

    if (p_back && !isFileEmpty(p_back)) {
      const fileName = `articles/${productId}/p_back/${randomUUID}`;

      p_back_url =
        p_back &&
        encodeURIComponent(
          `${fileName}${generateFileNameExtension(p_back[0].name)}`
        );

      const { error: pBackError } = await supabase.storage
        .from("products")
        .upload(
          `${fileName}${generateFileNameExtension(p_back[0].name)}`,
          p_back[0],
          {
            cacheControl: "3600",
            upsert: false,
          }
        );
      if (pBackError) throw pBackError;

      removeImage("p_back");
    }

    if (p_extra_1 && !isFileEmpty(p_extra_1)) {
      const fileName = `articles/${productId}/p_extra_1/${randomUUID}`;

      p_extra_1_url =
        p_extra_1 &&
        encodeURIComponent(
          `${fileName}${generateFileNameExtension(p_extra_1[0].name)}`
        );

      const { error: pExtra1Error } = await supabase.storage
        .from("products")
        .upload(
          `${fileName}${generateFileNameExtension(p_extra_1[0].name)}`,
          p_extra_1[0],
          {
            cacheControl: "3600",
            upsert: false,
          }
        );
      if (pExtra1Error) throw pExtra1Error;

      removeImage("p_extra_1");
    }

    if (p_extra_2 && !isFileEmpty(p_extra_2)) {
      const fileName = `articles/${productId}/p_extra_2/${randomUUID}`;

      p_extra_2_url =
        p_extra_2 &&
        encodeURIComponent(
          `${fileName}${generateFileNameExtension(p_extra_2[0].name)}`
        );

      const { error: pExtra2Error } = await supabase.storage
        .from("products")
        .upload(
          `${fileName}${generateFileNameExtension(p_extra_2[0].name)}`,
          p_extra_2[0],
          {
            cacheControl: "3600",
            upsert: false,
          }
        );
      if (pExtra2Error) throw pExtra2Error;

      removeImage("p_extra_2");
    }

    if (p_extra_3 && !isFileEmpty(p_extra_3)) {
      const fileName = `articles/${productId}/p_extra_3/${randomUUID}`;

      p_extra_3_url =
        p_extra_3 &&
        `${fileName}${generateFileNameExtension(p_extra_3[0].name)}`;

      const { error: pExtra3Error } = await supabase.storage
        .from("products")
        .upload(
          `${fileName}${generateFileNameExtension(p_extra_3[0].name)}`,
          p_extra_3[0],
          {
            cacheControl: "3600",
            upsert: false,
          }
        );
      if (pExtra3Error) throw pExtra3Error;

      removeImage("p_extra_3");
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

    // Beer type
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
      if (isNotEmptyArray(packs)) {
        packs.map(async (pack: IProductPack, index: number) => {
          const filename = `packs/${productId}/${randomUUID}_${index}`;
          const pack_url = encodeURIComponent(
            `${filename}${generateFileNameExtension(pack.name)}`
          );

          const { error: packsError } = await supabase
            .from("product_packs")
            .insert({
              product_id: productId,
              quantity: pack.quantity,
              price: pack.price,
              name: pack.name,
              img_url: pack_url,
              randomUUID: randomUUID,
            });

          if (packsError) throw packsError;

          if (pack.img_url) {
            const { error: storagePacksError } = await supabase.storage
              .from("products")
              .upload(
                `${filename}${generateFileNameExtension(pack.name)}`,
                pack.img_url[0],
                {
                  contentType: pack.img_url[0].type,
                  cacheControl: "3600",
                  upsert: false,
                }
              );

            if (storagePacksError) throw storagePacksError;
          }

          removeImage(`packs.${index}.img_url`);
        });
      }

      // Award
      if (isNotEmptyArray(awards) && isValidObject(awards[0].img_url)) {
        awards.map(async (award: IAward, index: number) => {
          if (award && !isFileEmpty(award.img_url)) {
            const filename = `awards/${productId}/${randomUUID}_${index}`;
            const award_url = encodeURIComponent(
              `${filename}${generateFileNameExtension(award.img_url[0].name)}`
            );

            const { error: awardsError } = await supabase
              .from("awards")
              .insert({
                product_id: productId,
                name: award.name,
                description: award.description,
                year: award.year,
                img_url: award_url,
              });

            if (awardsError) throw awardsError;

            const { error: storageAwardsError } = await supabase.storage
              .from("products")
              .upload(
                `${filename}${generateFileNameExtension(
                  award.img_url[0].name
                )}`,
                award.img_url[0],
                {
                  contentType: award.img_url[0].type,
                  cacheControl: "3600",
                  upsert: false,
                }
              );
            if (storageAwardsError) throw storageAwardsError;

            removeImage(`awards.${index}.img_url`);
          }
        });
      }

      return beer;
    }
  };

  const insertProductMutation = useMutation({
    mutationKey: ["insertProduct"],
    mutationFn: handleInsertProduct,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      setShowModal(false);
      setIsSubmitting(false);
      reset();
    },
    onError: (error: any) => {
      console.error(error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (formValues: ModalAddProductProps) => {
    try {
      insertProductMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
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
        handlerClose={() => {
          setActiveStep(0);
          setShowModal(false);
        }}
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
                <ProductInfoSection
                  form={form}
                  customizeSettings={customizeSettings}
                />
              ) : activeStep === 1 ? (
                <MultimediaSection form={form} />
              ) : activeStep === 2 ? (
                <AwardsSection form={form} />
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

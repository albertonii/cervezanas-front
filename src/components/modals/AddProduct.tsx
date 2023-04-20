import _ from "lodash";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  aroma_options,
  color_options,
  era_options,
  family_options,
  fermentation_options,
  origin_options,
  product_type_options,
} from "../../lib/beerEnum";
import { supabase } from "../../utils/supabaseClient";
import { AwardsSection } from "./AwardsSection";
import { MultimediaSection } from "./MultimediaSection";
import {
  Product,
  Inventory,
  CustomizeSettings,
  ModalAddProductProps,
} from "../../lib/types";
import { useAuth } from "../Auth";
import { Modal, ProductInfoSection, ProductStepper } from ".";
import { uuid } from "uuidv4";
import { ProductSummary } from "./ProductSummary";
import { getFileExtensionByName } from "../../utils";
import { isNotEmptyArray, isValidObject } from "../../utils/utils";

interface Props {
  products: Product[];
  handleSetProducts: Dispatch<SetStateAction<any>>;
  customizeSettings: CustomizeSettings;
}

export function AddProduct({
  products,
  handleSetProducts,
  customizeSettings,
}: Props) {
  const { t } = useTranslation();

  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState<number>(0);

  const handleSetActiveStep = (value: number) => {
    setActiveStep(value);
  };

  const form = useForm<ModalAddProductProps>({
    mode: "onSubmit",
    defaultValues: {
      awards: [],
    },
  });

  const {
    formState: { errors },
    handleSubmit,
    reset,
  } = form;

  const onSubmit = (formValues: ModalAddProductProps) => {
    const handleProductInsert = async () => {
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
        format,
        stock_quantity,
        stock_limit_notification,
        packs,
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
        })
        .select();

      if (productError) throw productError;

      const productId = productData[0].id;

      // Multimedia
      const randomUUID = uuid();

      const p_principal_url = !_.isEmpty(p_principal?.name)
        ? encodeURIComponent(
            `${productId}/p_principal/${randomUUID}.${getFileExtensionByName(
              p_principal.name
            )}`
          )
        : null;

      const p_back_url = !_.isEmpty(p_back?.name)
        ? encodeURIComponent(
            `${productId}/p_back/${randomUUID}.${getFileExtensionByName(
              p_back.name
            )}`
          )
        : null;

      const p_extra_1_url = !_.isEmpty(p_extra_1?.name)
        ? encodeURIComponent(
            `${productId}/p_extra_1/${randomUUID}.${getFileExtensionByName(
              p_extra_1.name
            )}`
          )
        : null;

      const p_extra_2_url = !_.isEmpty(p_extra_2?.name)
        ? encodeURIComponent(
            `${productId}/p_extra_2/${randomUUID}.${getFileExtensionByName(
              p_extra_2.name
            )}`
          )
        : null;

      const p_extra_3_url = !_.isEmpty(p_extra_3?.name)
        ? encodeURIComponent(
            `${productId}/p_extra_3/${randomUUID}.${getFileExtensionByName(
              p_extra_3.name
            )}`
          )
        : null;

      const { error: multError } = await supabase
        .from("product_multimedia")
        .insert({
          product_id: productId,
          p_principal: p_principal_url,
          p_back: p_back_url,
          p_extra_1: p_extra_1_url,
          p_extra_2: p_extra_2_url,
          p_extra_3: p_extra_3_url,
        });

      if (multError) throw multError;

      if (p_principal_url) {
        const { error: pPrincipalError } = await supabase.storage
          .from("products")
          .upload(
            `/articles/${productId}/p_principal/${randomUUID}.${getFileExtensionByName(
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

      if (p_back_url) {
        const { error: pBackError } = await supabase.storage
          .from("products")
          // .update(`p_back/${userId}/${p_back_url}`, p_back.name, {
          .upload(
            `/articles/${productId}/p_back/${randomUUID}.${getFileExtensionByName(
              p_back.name
            )}`,
            p_back,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
        if (pBackError) throw pBackError;
      }

      if (p_extra_1_url) {
        const { error: pExtra1Error } = await supabase.storage
          .from("products")
          .upload(
            `/articles/${productId}/p_extra_1/${randomUUID}.${getFileExtensionByName(
              p_extra_1.name
            )}`,
            p_extra_1,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
        if (pExtra1Error) throw pExtra1Error;
      }

      if (p_extra_2_url) {
        const { error: pExtra2Error } = await supabase.storage
          .from("products")
          .upload(
            `/articles/${productId}/p_extra_2/${randomUUID}.${getFileExtensionByName(
              p_extra_2.name
            )}`,
            p_extra_2,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
        if (pExtra2Error) throw pExtra2Error;
      }

      if (p_extra_3_url) {
        const { error: pExtra3Error } = await supabase.storage
          .from("products")
          .upload(
            `/articles/${productId}/p_extra_3/${randomUUID}.${getFileExtensionByName(
              p_extra_3.name
            )}`,
            p_extra_3,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
        if (pExtra3Error) throw pExtra3Error;
      }

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
        const stock: Inventory = {
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
          packs.map(async (pack) => {
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
              const file = pack.img_url;
              const productFileUrl = encodeURIComponent(file.name);

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
          awards.map(async (award) => {
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
        handleSetProducts((prev: any) => [...prev, productData[0]]);

        return beer;
      }
    };

    handleProductInsert();
    reset();
  };

  return (
    <form className="w-full">
      <Modal
        showBtn={true}
        isVisible={false}
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
              <p className="my-4 text-slate-500 text-lg leading-relaxed">
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

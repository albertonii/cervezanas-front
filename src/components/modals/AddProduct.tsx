import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  aroma_options,
  color_options,
  era_options,
  family_options,
  fermentation_options,
  intensity_options,
  origin_options,
  product_type_options,
  BeerEnum,
} from "../../lib/beerEnum";
import { supabase } from "../../utils/supabaseClient";
import { AwardsSection } from "./AwardsSection";
import { MultimediaSection } from "./MultimediaSection";
import { Product, Inventory, ModalAddProductProps } from "../../lib/types";
import { useAuth } from "../Auth";
import _ from "lodash";
import { Modal, ProductInfoSection, ProductStepper } from ".";

interface Props {
  products: Product[];
  handleSetProducts: Dispatch<SetStateAction<any>>;
}

export function AddProduct(props: Props) {
  const { t } = useTranslation();
  const { handleSetProducts } = props;

  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);

  const handleSetActiveStep = (value: number) => {
    setActiveStep(value);
  };

  const form = useForm<ModalAddProductProps>({
    mode: "onSubmit",
    defaultValues: {
      campaign: "-",
      name: "Jaira IPA",
      description: "-",
      color: 0,
      intensity: 0,
      aroma: 0,
      family: 0,
      fermentation: 0,
      origin: 0,
      era: 0,
      is_gluten: false,
      type: product_type_options[0].value,
      awards: [{ name: "", description: "", year: 0, img_url: "" }],
      is_public: false,
      volume: "",
      price: 0,
      pack: "",
      format: "",
      stock_quantity: 0,
      stock_limit_notification: 0,
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
        pack,
        format,
        stock_quantity,
        stock_limit_notification,
      } = formValues;

      const userId = user?.id;

      // Product
      // TODO: AÑADIR -> Nº ARTÍCULO, Nº VARIANTE, Nº ALEATORIO
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert({
          is_public: is_public,
          name: name,
          description: description,
          type,
          owner_id: userId,
          price,
        })
        .select();

      if (productError) throw productError;

      const productId = productData[0].id;

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
          .insert({
            intensity: intensity_options[intensity].label,
            fermentation: fermentation_options[fermentation].label,
            color: color_options[color].label,
            aroma: aroma_options[aroma].label,
            family: family_options[family].label,
            origin: origin_options[origin].label,
            era: era_options[era].label,
            is_gluten,
            volume,
            pack,
            format,
            product_id: productId,
          })
          .select();

        if (beerError) throw beerError;

        const beer = beerData[0];

        // Inventory - Stock
        const stock: Inventory = {
          product_id: productId,
          quantity: stock_quantity,
          limit_notification: stock_limit_notification,
        };

        const { error: stockError } = await supabase
          .from("product_inventory")
          .insert(stock);
        if (stockError) throw stockError;

        // Awards
        if (awards.length > 0 && awards[0].img_url != "") {
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

        handleSetProducts((prev: any) => [...prev, productData[0]]);
        return beer;
      }

      reset();
    };
    handleProductInsert();
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
                <>
                  <ProductInfoSection form={form} />
                </>
              ) : activeStep === 1 ? (
                <>
                  <AwardsSection form={form} />
                </>
              ) : activeStep === 2 ? (
                <>
                  <MultimediaSection form={form} />
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

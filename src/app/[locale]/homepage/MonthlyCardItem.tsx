"use client";

import Link from "next/link";
import DisplayImageProduct from "../components/common/DisplayImageProduct";
import React, { useEffect, useState } from "react";
import { SupabaseProps } from "../../../constants";
import { IMonthlyProduct } from "../../../lib/types";
import { useLocale, useTranslations } from "next-intl";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Auth/useAuth";
import { MonthlyProductCategory } from "../../../lib/productEnum";
import { IconButton } from "../components/common/IconButton";
import { Button } from "../components/common/Button";
import useFetchProductLikes from "../../../hooks/useFetchProductLikes";

interface Props {
  mProduct: IMonthlyProduct;
}

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export default function MonthlyCardItem({ mProduct }: Props) {
  const { supabase } = useAuth();
  const { products: product } = mProduct;
  if (!product) return <></>;

  const [categoryAwardUrl, setCategoryAwardUrl] = useState<string>("");

  const [isLike, setIsLike] = useState<boolean>(() => {
    const likes = product.likes?.some(
      (like) => like.owner_id === product?.owner_id
    );

    return !!likes;
  });

  const [likesCounter, setLikesCount] = useState<number>(0);

  const primaryImg =
    BASE_PRODUCTS_URL +
    decodeURIComponent(product?.product_multimedia?.[0].p_principal ?? "");

  const { error: fetchLikesError, refetch } = useFetchProductLikes(product?.id);

  useEffect(() => {
    refetch().then((res) => {
      setLikesCount(res.data ?? 0);
    });
  }, []);

  const t = useTranslations();
  const locale = useLocale();

  const categoryAwardToLoad = () => {
    const category = product?.category;

    switch (category) {
      case MonthlyProductCategory.community:
        setCategoryAwardUrl("/assets/medal.svg");
        break;

      case MonthlyProductCategory.expert_committee:
        setCategoryAwardUrl("/assets/medal.svg");
        break;

      case MonthlyProductCategory.experimental:
        setCategoryAwardUrl("/assets/medal.svg");
        break;

      default:
        setCategoryAwardUrl("/assets/medal.svg");
        break;
    }
  };

  const overAll = () => {
    const countReviews = product?.reviews?.length ?? 0;

    if (!countReviews) {
      return 0;
    }

    const overAll_sum =
      product?.reviews?.reduce((sum, review) => sum + review.overall, 0) ?? 0;

    if (overAll_sum === 0) return 0;

    const overAll_avg = overAll_sum / countReviews;
    const overAll_toFixed = overAll_avg.toFixed(1);

    return overAll_toFixed;
  };

  const heartColor = { filled: "#fdc300", unfilled: "grey" };

  async function handleLike() {
    if (!isLike) {
      const { error } = await supabase
        .from("likes")
        .insert([{ product_id: product?.id, owner_id: product?.owner_id }]);

      if (error) throw error;

      setIsLike(true);
      setLikesCount(likesCounter + 1);
    } else {
      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ product_id: product?.id, owner_id: product?.owner_id });

      if (error) throw error;

      setIsLike(false);
      setLikesCount(likesCounter - 1);
    }
  }

  if (fetchLikesError) console.error(fetchLikesError);

  return (
    <section
      key={mProduct.id}
      className="relative z-10 col-span-1 mb-4 bg-no-repeat shadow-lg sm:mr-4"
    >
      <header className="relative flex flex-row justify-center rounded-t-lg  bg-cerv-coffee py-2 text-center font-semibold text-cerv-cream">
        <h1>{product?.name}</h1>

        <figure className="absolute right-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-4 w-4 text-beer-blonde"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>

          <span className="mr-3  whitespace-nowrap text-gray-400">
            {overAll()}
          </span>
        </figure>
      </header>

      <div
        className={`h-[270px] bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: `url(${primaryImg})`,
          height: "270px",
        }}
      >
        <figure className="absolute left-4 top-2">
          <DisplayImageProduct
            imgSrc={"/assets/cerv-mes.webp"}
            alt={product?.name}
            width={100}
            height={100}
          />
        </figure>

        <div className="relative right-2 float-right space-y-2">
          <IconButton
            icon={faHeart}
            onClick={() => handleLike()}
            isActive={isLike}
            color={heartColor}
            classContainer={
              "transition ease-in duration-300 bg-gray-800 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0"
            }
            classIcon={""}
            title={t("add_to_favs")}
          >
            <span className=" pt-1 text-center text-base font-bold text-beer-foam">
              {likesCounter}
            </span>
          </IconButton>
          <div className="h-[30px] w-[30px] bg-[url('/assets/bla.svg')] bg-no-repeat  pt-1 text-center text-xs font-bold">
            25
          </div>
        </div>
        <div className="relative top-48 w-max border-b-2  border-r-2 border-t-2 border-yellow-400 bg-cerv-coffee p-1 pr-3 text-xs font-bold text-white">
          {t(`${mProduct.category}`)}
        </div>
      </div>

      <footer className="rounded-b-md bg-cerv-coffee p-2">
        <Button primary class="w-full">
          <Link
            target={"_blank"}
            href={`/products/${product?.id}`}
            locale={locale}
          >
            {t("get_to_know_more")}
          </Link>
        </Button>
      </footer>
    </section>
  );
}

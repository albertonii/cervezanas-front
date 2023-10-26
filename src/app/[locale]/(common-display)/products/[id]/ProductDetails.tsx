import Packs from "./Packs";
import DistributionInformation from "./DistributionInformation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Rate } from "../../../components/reviews/Rate";
import { SupabaseProps } from "../../../../../constants";
import { ProductGallery } from "../../../components/ProductGallery";
import { ICarouselItem, IProduct } from "../../../../../lib/types.d";
import { formatCurrency } from "../../../../../utils/formatCurrency";
import { useAuth } from "../../../Auth/useAuth";

const productsUrl = `${SupabaseProps.BASE_URL}${SupabaseProps.STORAGE_PRODUCTS_IMG_URL}`;

interface Props {
  product: IProduct;
  reviewRef: React.MutableRefObject<any>;
}

export default function ProductDetails({ product, reviewRef }: Props) {
  const t = useTranslations();
  const { supabase } = useAuth();

  const [isLike, setIsLike] = useState<boolean>(Boolean(product.likes?.length));
  const [gallery, setGallery] = useState<ICarouselItem[]>([]);

  const starColor = { filled: "#fdc300", unfilled: "#a87a12" };
  const reviews = product.reviews;
  const selectedMultimedia = product.product_multimedia[0] ?? [];

  const handleSetIsLike = async (value: React.SetStateAction<boolean>) => {
    setIsLike(value);
    await handleLike();
  };

  const productStars = useMemo(() => {
    const sum = reviews?.reduce((acc, review) => acc + review.overall, 0) ?? 0;
    return reviews?.length ? sum / reviews.length : 0;
  }, [reviews]);

  const executeScroll = useCallback(
    () => reviewRef.current.scrollIntoView(),
    [reviewRef]
  );

  async function handleLike() {
    if (!isLike) {
      const { error } = await supabase
        .from("likes")
        .insert([{ product_id: product.id, owner_id: product.owner_id }]);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ product_id: product.id, owner_id: product.owner_id });

      if (error) throw error;
    }
  }

  useEffect(() => {
    const { p_principal, p_back, p_extra_1, p_extra_2, p_extra_3 } =
      selectedMultimedia;

    setGallery(
      [
        ...[
          {
            link: "/",
            title: "Principal",
            imageUrl:
              p_principal && productsUrl + decodeURIComponent(p_principal),
          },
        ],
        ...[
          {
            link: "/",
            title: "Back",
            imageUrl: p_back && productsUrl + decodeURIComponent(p_back),
          },
        ],
        ...[
          {
            link: "/",
            title: "Photo Extra 1",
            imageUrl: p_extra_1 && productsUrl + decodeURIComponent(p_extra_1),
          },
        ],
        ...[
          {
            link: "/",
            title: "Photo Extra 2",
            imageUrl: p_extra_2 && productsUrl + decodeURIComponent(p_extra_2),
          },
        ],
        ...[
          {
            link: "/",
            title: "Photo Extra 3",
            imageUrl: p_extra_3 && productsUrl + decodeURIComponent(p_extra_3),
          },
        ],
      ].filter(({ imageUrl }) => imageUrl && !imageUrl.includes("undefined"))
    );
  }, [
    selectedMultimedia.p_back,
    selectedMultimedia.p_extra_1,
    selectedMultimedia.p_extra_2,
    selectedMultimedia.p_extra_3,
    selectedMultimedia.p_principal,
    product.owner_id,
  ]);

  return (
    <>
      <section className="aspect-w-2 aspect-h-3 col-span-12 mx-6 flex items-center justify-center rounded-lg bg-beer-blonde/20 md:overflow-hidden lg:col-span-4">
        <ProductGallery
          gallery={gallery}
          isLike={isLike}
          handleSetIsLike={handleSetIsLike}
        />
      </section>

      <section className="col-span-12 mx-6 space-y-4 lg:col-span-8">
        <section className="flex flex-col sm:flex-row sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
            {product.name}
          </h2>

          <>
            <h4 className="sr-only">{t("reviews")}</h4>

            <div className="flex flex-col items-end justify-end">
              <div className="flex items-center">
                <Rate
                  rating={productStars}
                  onRating={() => void {}}
                  count={5}
                  color={starColor}
                  editable={false}
                />
              </div>

              <>
                <p className="sr-only">{productStars} out of 5 stars</p>
                <p
                  onClick={() => executeScroll()}
                  className="ml-3 text-sm font-medium text-beer-draft hover:cursor-pointer hover:text-beer-dark"
                >
                  {reviews?.length} {t("reviews")}
                </p>
              </>
            </div>
          </>
        </section>

        <section aria-labelledby="information-heading" className="">
          <h3 id="information-heading" className="sr-only">
            {t("product_information")}
          </h3>

          <p className="text-2xl text-gray-900">
            {formatCurrency(product.price)}
          </p>

          <div className="mt-6">
            <div className="flex min-h-[6vh] items-center pr-6">
              <p className="text-lg">{product.description}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="packs" className="">
          <Packs product={product} />
        </section>

        {/* Distribution Information  */}
        <section aria-labelledby="distribution-information-heading">
          <h3 id="distribution-heading" className="sr-only">
            {t("distribution_information")}
          </h3>

          <DistributionInformation product={product} />
        </section>
      </section>
    </>
  );
}

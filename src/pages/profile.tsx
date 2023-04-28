import SubmittedCPs from "../components/Admin/cps/SubmittedCPs";
import MonthlyBeers from "../components/Admin/monthly/MonthlyProducts";
import { ClientContainerLayout } from "../components/customLayout/ClientContainerLayout";
import { useEffect, useState } from "react";
import { useAppContext } from "../components/Context/AppContext";
import { useAuth } from "../components/Auth/useAuth";
import { supabase } from "../utils/supabaseClient";
import {
  IConsumptionPoints,
  IMonthlyProduct,
  IProductLot,
  IProfile,
  IReview,
} from "../lib/types.d";
import {
  Account,
  Sidebar,
  Ledger,
  Stats,
  LikesHistory,
  Reviews,
  Campaigns,
  Factories,
  Orders,
  Community,
  ConfigureProducts,
  Profile,
  ConsumptionPoints,
} from "../components/customLayout/index";
import { Spinner } from "../components/common";
import { useRouter } from "next/router";
import { isValidObject } from "../utils/utils";

interface Props {
  submittedCPs: IConsumptionPoints[];
  mProducts: IMonthlyProduct[];
  profile: IProfile;
  reviews: IReview[];
  product_lots: IProductLot[];
  cps: IConsumptionPoints[];
}

export default function CustomLayout({
  submittedCPs,
  mProducts,
  profile,
  reviews,
  product_lots,
  cps,
}: Props) {
  const { loggedIn } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const { user, role } = useAuth();
  const { sidebar, changeSidebarActive } = useAppContext();
  const [menuOption, setMenuOption] = useState<string>(sidebar);

  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isValidObject(router.query.a)) {
      setMenuOption(router.query.a as string);
      changeSidebarActive(router.query.a as string);
      router.query.a = "";
    } else {
      /*
      if (role === "admin") {
        setMenuOption("submitted_aps");
        changeSidebarActive("submitted_aps");
      }
      */
    }
  }, [changeSidebarActive, role, router]);

  const renderSwitch = (): JSX.Element => {
    if (!user) return <></>;

    switch (menuOption) {
      case "submitted_aps":
        return <SubmittedCPs submittedCPs={submittedCPs} />;
      case "monthly_beers":
        return <MonthlyBeers mProducts={mProducts} />;
      case "profile":
        return <Profile profile={profile} />;
      case "products":
        return (
          <ConfigureProducts
            products={profile.products}
            lots={product_lots}
            customizeSettings={profile.customize_settings[0]}
          />
        );
      case "campaigns":
        return (
          <Campaigns
            campaigns={profile.campaigns}
            products={profile.products}
          />
        );
      case "factories":
        return <Factories />;
      case "orders":
        return <Orders orders={profile?.orders ?? []} />;
      case "community":
        return <Community />;
      case "stats":
        return <Stats />;
      case "ledger":
        return <Ledger />;
      case "likes_history":
        return <LikesHistory userId={user.id} />;
      case "reviews":
        return <Reviews reviews={reviews} />;
      case "consumption_points":
        return <ConsumptionPoints profile={profile} cps={cps} />;
      default:
        return <Account profile={profile} />;
    }
  };

  const handleMenuOptions = (childData: string) => {
    changeSidebarActive(childData);
    setMenuOption(childData);
  };

  if (role == null || user == null) return <></>;

  return (
    <>
      {loading ? (
        <Spinner color="beer-blonde" size={"medium"} />
      ) : (
        <div className="flex flex-row">
          {loggedIn && (
            <>
              <Sidebar parentCallback={handleMenuOptions} role={role} />
              <ClientContainerLayout role={role} user={user}>
                {renderSwitch()}
              </ClientContainerLayout>
            </>
          )}
        </div>
      )}
    </>
  );
}

export async function getServerSideProps({ req }: any) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .select(
      `
        *,
        orders (*),
        campaigns (*),
        customize_settings (*),
        profile_location (*)
      `
    )
    .eq("id", user?.id);

  if (profileError) throw profileError;

  // Return different data by role
  if (
    profileData[0].role === "producer" ||
    profileData[0].role === "consumer"
  ) {
    const {
      data: productsData,
      error: productsError,
      count,
    } = await supabase
      .from("products")
      .select(
        `
        *, 
        product_multimedia (*),
        product_inventory (*),
        likes (*),
        product_lot (*),
        beers (*), 
        product_pack (*)
      `
      )
      .eq("owner_id", user?.id);

    if (productsError) throw productsError;

    const { data: reviewData, error: reviewError } = await supabase
      .from("reviews")
      .select(
        `
        *,
        products (*,
          product_multimedia (*)
        ),
        users (*)
      `
      )
      .eq("owner_id", user?.id);

    if (reviewError) throw reviewError;

    const { data: productLotData, error: productLotError } = await supabase
      .from("product_lot")
      .select(
        `
      *,
      products (
        *
      )
    `
      )
      .eq("owner_id", user?.id);

    if (productLotError) console.error(productLotError);

    const { data: cps, error: cpsError } = await supabase
      .from("consumption_points")
      .select(
        `
        *,
        cp_fixed (*),
        cp_mobile (*)
      `
      )
      .eq("owner_id", user?.id);
    if (cpsError) console.error(cpsError);

    profileData[0].products = productsData;

    return {
      props: {
        products_count: count,
        product_lots: productLotData ?? [],
        profile: profileData[0] ?? [],
        reviews: reviewData ?? [],
        cps: cps ?? [],
      },
    };
  } else {
    const { data: submittedCPs, error: submittedCPsError } = await supabase
      .from("consumption_points")
      .select(
        `
        *,
        owner_id (id, name, email, username, role)
        `
      );

    if (submittedCPsError) console.error(submittedCPsError);

    const { data: mProducts, error: mProductsError } = await supabase.from(
      "monthly_products"
    ).select(`*,
              product_id(*)
              `);

    if (mProductsError) console.error(mProductsError);

    return {
      props: {
        submittedCPs,
        mProducts,
      },
    };
  }
}

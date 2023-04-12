import { ClientContainerLayout } from "../components/customLayout/ClientContainerLayout";
import { useEffect, useState } from "react";
import { useAppContext } from "../components/Context/AppContext";
import { useAuth } from "../components/Auth/useAuth";
import { supabase } from "../utils/supabaseClient";
import {
  IConsumptionPoints,
  ProductLot,
  Profile as ProfileType,
  Review,
} from "../lib/types";
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

interface Props {
  profile: ProfileType[];
  reviews: Review[];
  product_lots: ProductLot[];
  cps: IConsumptionPoints;
}

export default function CustomLayout({
  profile,
  reviews,
  product_lots,
  cps,
}: Props) {
  const { loggedIn } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { sidebar, changeSidebarActive } = useAppContext();
  const [menuOption, setMenuOption] = useState<string>(sidebar);

  useEffect(() => {
    setLoading(false);
  }, []);

  const renderSwitch = (): JSX.Element => {
    if (profile && reviews) {
      switch (menuOption) {
        case "profile":
          return <Profile profile={profile[0]} />;
        case "products":
          return (
            <ConfigureProducts
              products={profile[0].products}
              lots={product_lots}
              customizeSettings={profile[0].customize_settings[0]}
            />
          );
        case "campaigns":
          return (
            <Campaigns
              campaigns={profile[0].campaigns}
              products={profile[0].products}
            />
          );
        case "factories":
          return <Factories />;
        case "orders":
          return <Orders orders={profile[0]?.orders ?? []} />;
        case "community":
          return <Community />;
        case "stats":
          return <Stats />;
        case "ledger":
          return <Ledger />;
        case "likes_history":
          return <LikesHistory userId={user!.id} />;
        case "reviews":
          return <Reviews reviews={reviews} />;
        case "consumption_points":
          return <ConsumptionPoints profile={profile[0]} cps={cps} />;
      }
    }

    return <Account profile={profile[0]} />;
  };

  const handleMenuOptions = (childData: string) => {
    changeSidebarActive(childData);
    setMenuOption(childData);
  };

  return (
    <>
      {loading ? (
        <Spinner color="beer-blonde" size={"medium"} />
      ) : (
        <div className="flex flex-row">
          {loggedIn && (
            <>
              <Sidebar parentCallback={handleMenuOptions} />
              <ClientContainerLayout>{renderSwitch()}</ClientContainerLayout>
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

  let { data: profileData, error: profileError } = await supabase
    .from("users")
    .select(
      `
        *,
        products (
          *, 
          product_multimedia (*),
          product_inventory (*),
          likes (*),
          product_lot (*),
          beers (*),
          product_pack (*)
        ),
        orders (*),
        campaigns (*),
        customize_settings (*),
        profile_location (*)
      `
    )
    .eq("id", user?.id);

  if (profileError) throw profileError;

  if (profileData === undefined || profileData === null) {
    profileData = [];
  }

  let { data: reviewData, error: reviewError } = await supabase
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

  if (reviewData === undefined || reviewData === null) {
    reviewData = [];
  }

  let { data: productLotData, error: productLotError } = await supabase
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

  let { data: cps, error: cpsError } = await supabase
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
  console.log(cps![0]);

  if (productLotData === undefined || productLotData === null) {
    productLotData = [];
  }

  return {
    props: {
      product_lots: productLotData,
      profile: profileData,
      reviews: reviewData,
      cps: cps,
    },
  };
}

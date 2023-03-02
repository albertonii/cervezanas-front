import { ClientContainerLayout } from "../components/customLayout/ClientContainerLayout";
import { useEffect, useState } from "react";
import { useAppContext } from "../components/Context/AppContext";
import { useAuth } from "../components/Auth/useAuth";
import { Layout } from "../components/index";
import { supabase } from "../utils/supabaseClient";
import {
  Campaign,
  Like,
  Order,
  Product,
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
} from "../components/customLayout/index";
import { Spinner } from "../components/common";

interface Props {
  profile: ProfileType[];
  reviews: Review[];
  product_lots: ProductLot[];
}

export default function CustomLayout({
  profile,
  reviews,
  product_lots,
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
      }
    }

    return <Account profile={profile[0]} />;
  };

  const handleMenuOptions = (childData: string) => {
    changeSidebarActive(childData);
    setMenuOption(childData);
  };

  return (
    <Layout usePadding={false} useBackdrop={false}>
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
    </Layout>
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
          product_lot (*)
        ),
        orders (*),
        campaigns (*)
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

  if (productLotError) console.log(productLotError);

  if (productLotData === undefined || productLotData === null) {
    productLotData = [];
  }

  return {
    props: {
      product_lots: productLotData,
      profile: profileData,
      reviews: reviewData,
    },
  };
}

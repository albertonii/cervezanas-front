import { ClientContainerLayout } from "../components/customLayout/ClientContainerLayout";
import { useEffect, useState } from "react";
import { Campaigns } from "../components/customLayout/Campaigns/Campaigns";
import { Factories } from "../components/customLayout/Factories/Factories";
import { Orders } from "../components/customLayout/Orders/Orders";
import { Community } from "../components/customLayout/Community/Community";
import { useAppContext } from "../components/Context/AppContext";
import { useAuth } from "../components/Auth/useAuth";
import { Layout } from "../components/index";
import { supabase } from "../utils/supabaseClient";
import { Campaign, Like, Order, Product, Review } from "../lib/types";
import {
  Account,
  Products,
  Profile,
  Sidebar,
  Ledger,
  Stats,
  LikesHistory,
} from "../components/customLayout/index";
import { Spinner } from "../components/common";

interface Props {
  profile: [
    {
      avatar_url: string;
      bg_url: string;
      birthdate: string;
      created_at: string;
      updated_at: string;
      email: string;
      image: string;
      name: string;
      lastname: string;
      phone: string;
      role: string;
      username: string;
      products: Product[];
      reviews: Review[];
      likes: Like[];
      orders: Order[];
      campaigns: Campaign[];
    }
  ];
}

export default function CustomLayout({ profile }: Props) {
  const { loggedIn } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();
  const { sidebar, changeSidebarActive } = useAppContext();
  const [menuOption, setMenuOption] = useState<string>(sidebar);

  useEffect(() => {
    setLoading(false);
  }, []);

  const renderSwitch = (): JSX.Element => {
    if (profile) {
      switch (menuOption) {
        case "profile":
          return <Profile />;
        case "products":
          return <Products products={profile[0].products} />;
        case "campaigns":
          return <Campaigns campaigns={profile[0].campaigns} />;
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
      }
    }

    return <Account user={profile} />;
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

              {/* <ProfileContexProvider> */}
              <ClientContainerLayout>{renderSwitch()}</ClientContainerLayout>
              {/* </ProfileContexProvider> */}
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
          reviews (*)
        ),
        orders (*),
        campaigns (*)
      `
    )
    .eq("id", user?.id);

  if (profileError) throw profileError;

  // productsData?.map(async (userData, index) => {
  //   product.product_multimedia[0].p_principal =
  //     product.product_multimedia[0]?.p_principal == undefined || null
  //       ? `/marketplace_product_default.png`
  //       : `${SupabaseProps.BASE_PRODUCTS_URL}${SupabaseProps.PRODUCT_P_PRINCIPAL}/${product.owner_id}/${product.product_multimedia[0].p_principal}`;

  //   productsData![index] = product;
  // });

  if (profileData === undefined || profileData === null) {
    profileData = [];
  }

  return {
    props: {
      profile: profileData,
    },
  };
}

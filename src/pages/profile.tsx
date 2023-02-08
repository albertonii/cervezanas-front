import { Sidebar } from "../components/customLayout/Sidebar";
import { ClientContainerLayout } from "../components/customLayout/ClientContainerLayout";
import { useEffect, useState } from "react";
import { Account } from "../components/customLayout/Profile/Account";
import { Products } from "../components/customLayout/Products/Products";
import { Campaigns } from "../components/customLayout/Campaigns/Campaigns";
import { Factories } from "../components/customLayout/Factories/Factories";
import { Orders } from "../components/customLayout/Orders/Orders";
import { Community } from "../components/customLayout/Community/Community";
import { Stats } from "../components/customLayout/Stats/Stats";
import { Ledger } from "../components/customLayout/Ledger/Ledger";
import { Profile } from "../components/customLayout/Profile/Profile";
import ProfileContexProvider, {
  useAppContext,
} from "../components/Context/AppContext";
import LikesHistory from "../components/customLayout/Likes/LikesHistory";
import { useAuth } from "../components/Auth/useAuth";
import Layout from "../components/Layout";
import { supabase } from "../utils/supabaseClient";
import { Campaign, Like, Order, Product, Review } from "../lib/types";

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

const CustomLayout = ({ profile }: Props) => {
  const [menuOption, setMenuOption] = useState<string>();

  const { loggedIn } = useAuth();

  const { user } = useAuth();
  const { changeSidebarActive } = useAppContext();

  useEffect(() => {
    if (!!user) {
      setMenuOption("profile");
    }
  }, [user]);

  const renderSwitch = (): JSX.Element => {
    if (profile) {
      switch (menuOption) {
        case "profile":
          return <Profile profile={profile} />;
        case "products":
          return <Products />;
        case "campaigns":
          return <Campaigns />;
        case "factories":
          return <Factories />;
        case "orders":
          return <Orders orders={profile[0].orders} />;
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
      <div className="flex flex-row">
        {loggedIn && (
          <>
            <Sidebar parentCallback={handleMenuOptions} />

            <ProfileContexProvider>
              <ClientContainerLayout>{renderSwitch()}</ClientContainerLayout>
            </ProfileContexProvider>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CustomLayout;

export async function getServerSideProps({ req }: any) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

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
        orders (*)
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

  return {
    props: {
      profile: profileData,
    },
  };
}

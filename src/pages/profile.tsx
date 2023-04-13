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
import SubmittedCPs from "../components/admin/SubmittedCPs";
import { useRouter } from "next/router";
import { isValidObject } from "../utils/utils";

interface Props {
  submittedCPs: IConsumptionPoints[];
  profile: ProfileType;
  reviews: Review[];
  product_lots: ProductLot[];
  cps: IConsumptionPoints;
}

export default function CustomLayout({
  submittedCPs,
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
    } else {
      if (role === "admin") {
        setMenuOption("submitted_aps");
        changeSidebarActive("submitted_aps");
      } else {
        setMenuOption("account");
        changeSidebarActive("account");
      }
    }
  }, [changeSidebarActive, role, router]);

  const renderSwitch = (): JSX.Element => {
    switch (menuOption) {
      case "submitted_aps":
        return <SubmittedCPs submittedCPs={submittedCPs} />;
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
        return <LikesHistory userId={user!.id} />;
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

  if (role === null || user === null) return <></>;

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

  // Return different data by role
  if (
    profileData[0].role === "producer" ||
    profileData[0].role === "consumer"
  ) {
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

    if (productLotData === undefined || productLotData === null) {
      productLotData = [];
    }

    return {
      props: {
        product_lots: productLotData,
        profile: profileData[0],
        reviews: reviewData,
        cps: cps,
      },
    };
  } else {
    let { data: submittedCPs, error: submittedCPsError } = await supabase
      .from("consumption_points")
      .select(
        `
        *,
        owner_id (id, name, email, username, role)
        `
      );

    if (submittedCPsError) console.error(submittedCPsError);
    return {
      props: {
        submittedCPs: submittedCPs,
      },
    };
  }
}

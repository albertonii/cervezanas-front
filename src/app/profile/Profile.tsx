"use client";

import MonthlyBeers from "../../components/homepage/MonthlyBeers";
import SubmittedCPs from "../../components/Admin/cps/SubmittedCPs";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../components/Auth";
import { Spinner } from "../../components/common";
import { useAppContext } from "../../components/Context";
import {
  Account,
  Campaigns,
  ClientContainerLayout,
  Community,
  ConfigureProducts,
  ConsumptionPoints,
  Factories,
  Ledger,
  LikesHistory,
  Orders,
  Reviews,
  Sidebar,
  Stats,
} from "../../components/customLayout";
import {
  IConsumptionPoints,
  IMonthlyProduct,
  IProfile,
  IRefProductLot,
  IReview,
} from "../../lib/types.d";
import { isValidObject } from "../../utils/utils";

interface Props {
  submittedCPs: IConsumptionPoints[];
  monthlyProducts: IMonthlyProduct[];
  profile: IProfile;
  reviews: IReview[];
  product_lots: IRefProductLot[];
  cps: IConsumptionPoints[];
}

export default function Profile({
  submittedCPs,
  monthlyProducts,
  profile,
  reviews,
  product_lots,
  cps,
}: Props) {
  const { loggedIn, user, role } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const {
    sidebar,
    changeSidebarActive,
    setProducts,
    setLots,
    setCustomizeSettings,
  } = useAppContext();
  const [menuOption, setMenuOption] = useState<string>(sidebar);

  const params = useParams();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    setProducts(profile.products);
    setLots(product_lots);
    setCustomizeSettings(profile.customize_settings[0]);
  }, [profile, product_lots]);

  useEffect(() => {
    if (!params) return;
    if (isValidObject(params.a)) {
      setMenuOption(params.a as string);
      changeSidebarActive(params.a as string);
      params.a = "";
    } else {
      /*
      if (role === "admin") {
        setMenuOption("submitted_aps");
        changeSidebarActive("submitted_aps");
      }
      */
    }
  }, [changeSidebarActive, role, params]);

  const handleMenuOptions = (childData: string) => {
    changeSidebarActive(childData);
    setMenuOption(childData);
  };

  const renderSwitch = (): JSX.Element => {
    if (!user) return <></>;

    switch (menuOption) {
      case "submitted_aps":
        return <SubmittedCPs submittedCPs={submittedCPs} />;
      case "monthly_beers":
        return <MonthlyBeers monthlyProducts={monthlyProducts} />;
      //   case "profile":
      //     return <Profile profile={profile} />;
      case "products":
        return <ConfigureProducts />;
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

  if (role == null || user == null) return <></>;

  return (
    <>
      {loading ? (
        <Spinner color="beer-blonde" size={"medium"} />
      ) : (
        <div className="flex flex-row">
          {loggedIn && (
            <>
              <Sidebar />
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

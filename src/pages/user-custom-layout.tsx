import { type NextPage } from "next";
import { type UserProps } from "../lib/types";
import { Sidebar } from "../components/CustomLayout/Sidebar";
import { ClientContainerLayout } from "../components/CustomLayout/ClientContainerLayout";
import { useEffect, useState } from "react";
import { Account } from "../components/CustomLayout/Profile/Account";
import { Products } from "../components/CustomLayout/Products/Products";
import { Campaigns } from "../components/CustomLayout/Campaigns/Campaigns";
import { Factories } from "../components/CustomLayout/Factories/Factories";
import { Orders } from "../components/CustomLayout/Orders/Orders";
import { Community } from "../components/CustomLayout/Community/Community";
import { Stats } from "../components/CustomLayout/Stats/Stats";
import { Ledger } from "../components/CustomLayout/Ledger/Ledger";
import { Profile } from "../components/CustomLayout/Profile/Profile";
import { useUser } from "../components/Auth/UserContext";
import ProfileContexProvider from "../components/Context/ProfileContext";
import { supabase } from "../utils/supabaseClient";

const CustomLayout: NextPage<UserProps> = () => {
  const [menuOption, setMenuOption] = useState<string>();

  const { user } = useUser();

  useEffect(() => {
    if (!!user) {
      setMenuOption("profile");
    }
  }, [user]);

  const renderSwitch = (): JSX.Element => {
    switch (menuOption) {
      case "profile":
        return <Profile user={user} />;
      case "products":
        return <Products />;
      case "campaigns":
        return <Campaigns />;
      case "factories":
        return <Factories />;
      case "orders":
        return <Orders />;
      case "community":
        return <Community />;
      case "stats":
        return <Stats />;
      case "ledger":
        return <Ledger />;
    }

    return <Account user={user} />;
  };

  const handleMenuOptions = (childData: string) => {
    setMenuOption(childData);
  };

  return (
    <div className="flex flex-row">
      <Sidebar parentCallback={handleMenuOptions} />
      <ProfileContexProvider>
        <ClientContainerLayout>{renderSwitch()}</ClientContainerLayout>
      </ProfileContexProvider>
    </div>
  );
};

export default CustomLayout;

export async function getServerSideProps() {
  const user = supabase.auth.user();
  console.log(user);
  return {
    props: {},
  };
}

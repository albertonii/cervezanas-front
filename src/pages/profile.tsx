import { type NextPage } from "next";
import { type UserProps } from "../lib/types";
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
import { useUser } from "../components/Auth/UserContext";
import ProfileContexProvider from "../components/Context/ProfileContext";

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

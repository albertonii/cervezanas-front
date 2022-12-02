import { type NextPage } from "next";
import { type UserProps } from "../lib/types";
import { Sidebar } from "../components/CustomLayout/Sidebar";
import { ClientContainerLayout } from "../components/CustomLayout/ClientContainerLayout";
import { useEffect, useState } from "react";
import { Account } from "../components/CustomLayout/Profile/Account";
import { Products } from "../components/CustomLayout/Products/Products";

const CustomLayout: NextPage<UserProps> = ({ user }) => {
  const [menuOption, setMenuOption] = useState<string>("profile");

  const renderSwitch = (): JSX.Element => {
    switch (menuOption) {
      case "profile":
        return <Account />;
      case "products":
        return <Products />;
      case "campaigns":
        return <Account />;
      case "factories":
        return <Account />;
      case "orders":
        return <Account />;
      case "community":
        return <Account />;
      case "stats":
        return <Account />;
      case "ledger":
        return <Account />;
    }

    return <Account />;
  };

  const handleMenuOptions = (childData: string) => {
    setMenuOption(childData);
  };

  return (
    <div className="flex flex-row">
      <Sidebar parentCallback={handleMenuOptions} />
      <ClientContainerLayout>{renderSwitch()}</ClientContainerLayout>
    </div>
  );
};

export default CustomLayout;

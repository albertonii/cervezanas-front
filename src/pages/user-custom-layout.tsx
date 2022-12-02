import { type NextPage } from "next";
import { type UserProps } from "../lib/types";
import { Sidebar } from "../components/CustomLayout/Sidebar";
import { ClientContainerLayout } from "../components/CustomLayout/ClientContainerLayout";

const CustomLayout: NextPage<UserProps> = ({ user }) => {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <ClientContainerLayout />
    </div>
  );
};

export default CustomLayout;

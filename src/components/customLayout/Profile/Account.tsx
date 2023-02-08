import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BasicDataForm } from "./BasicDataForm";
import SecretDataForm from "./SecretDataForm";
import LocationForm from "./LocationForm";
import CustomizeProfileForm from "./CustomizeProfileForm";
import { supabase } from "../../../utils/supabaseClient";
import { User } from "@supabase/supabase-js";

interface Props {
  // user: User | null;
  user: any;
}

export const Account = ({ user }: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState<any>();

  // useEffect(() => {
  //   const getUserData = async () => {
  //     const { data, error } = await supabase
  //       .from("users")
  //       .select("*")
  //       .eq("id", user?.id);

  //     if (error) throw error;

  //     setUserData(data[0]);
  //   };

  //   if (user != null && user != undefined) {
  //     getUserData();
  //     setLoading(false);
  //   }

  //   return () => {
  //     setUserData(null);
  //   };
  // }, [user]);

  return (
    <>
      <div className="py-6 px-4" id="account-container">
        <div className="flex justify-between py-4" id="header">
          <div id="title" className="text-4xl">
            {t("profile_title_my_data")}
          </div>
          <div id="rrss" className="text-4xl">
            {t("profile_title_ssnn")}
          </div>
        </div>

        {loading ? (
          <div>{t("loading")}</div>
        ) : (
          <div>
            {/* <BasicDataForm profileData={userData} /> */}
            <SecretDataForm />
            <LocationForm />
            <CustomizeProfileForm user={user} />
          </div>
        )}
      </div>
    </>
  );
};

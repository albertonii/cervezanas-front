import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BasicDataForm } from "./BasicDataForm";
import { supabase } from "../../../utils/supabaseClient";
import SecretDataForm from "./SecretDataForm";
import LocationForm from "./LocationForm";
import { User } from "@supabase/supabase-js";

interface Props {
  user: User | null;
}

export const Account = (props: Props) => {
  const { user } = props;
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  // const { data: profileData } = useProfile();
  const [profileData, setProfileData] = useState<any>();

  useEffect(() => {
    if (user) {
      const getProfileData = async () => {
        let { data, error } = await supabase
          .from("users")
          .select("id, username, given_name, lastname, birthdate")
          .eq("id", user?.id);

        if (error) {
          throw error;
        }

        if (data) {
          setProfileData(data);
          setLoading(false);
        }

        return data;
      };

      getProfileData();
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <div>Loading ... </div>
      ) : (
        <div className="py-6 px-4" id="account-container">
          <div className="flex justify-between py-4" id="header">
            <div id="title" className="text-4xl">
              {t("profile_title_my_data")}
            </div>
            <div id="rrss" className="text-4xl">
              {t("profile_title_ssnn")}
            </div>
          </div>

          <BasicDataForm profileData={profileData} />

          <SecretDataForm />

          <LocationForm />
        </div>
      )}
    </>
  );
};

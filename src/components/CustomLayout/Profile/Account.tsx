import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BasicDataForm } from "./BasicDataForm";
import SecretDataForm from "./SecretDataForm";
import LocationForm from "./LocationForm";
import { User } from "@supabase/supabase-js";
import CustomizeProfileForm from "./CustomizeProfileForm";

interface Props {
  user: User | null;
  profileData: any;
}

export const Account = (props: Props) => {
  const { user, profileData } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user != null && user != undefined) {
      setLoading(false);
    }
  }, [user]);

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
          <div>Loading ...</div>
        ) : (
          <div>
            <BasicDataForm profileData={profileData} />
            <SecretDataForm />
            <LocationForm />
            <CustomizeProfileForm user={user} />
          </div>
        )}
      </div>
    </>
  );
};

import { useTranslation } from "react-i18next";
import {
  SecretDataForm,
  LocationForm,
  CustomizeProfileForm,
  BasicDataForm,
} from "..";
import { Profile } from "../../../lib/types.d";

interface Props {
  profile: Profile;
}

export function Account({ profile }: Props) {
  const { t } = useTranslation();

  if (!profile) return null;

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

        <div>
          <BasicDataForm profile={profile} />
          <SecretDataForm />
          <LocationForm profile_location={profile.profile_location[0]} />
          <CustomizeProfileForm profile={profile} />
        </div>
      </div>
    </>
  );
}

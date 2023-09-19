"use client";

import { useTranslations } from "next-intl";
import { IUserTable } from "../../../../../../lib/types.d";
import { BasicDataForm } from "./BasicDataForm";
import { CustomizeProfileForm } from "./CustomizeProfileForm";
import { SecretDataForm } from "./SecretDataForm";

interface Props {
  profile: IUserTable;
}

export function Account({ profile }: Props) {
  if (!profile) return <></>;

  const t = useTranslations();

  return (
    <>
      <div className="px-4 py-6" id="account-container">
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
          {/* <LocationForm profile_location={profile.profile_location} /> */}
          <CustomizeProfileForm profile={profile} />
        </div>
      </div>
    </>
  );
}

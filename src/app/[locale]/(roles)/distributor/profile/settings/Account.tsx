"use client";

import { useTranslations } from "next-intl";
import { IDistributorUser } from "../../../../../../lib/types";
import { SecretDataForm } from "./SecretDataForm";
import { CustomizeProfileForm } from "./CustomizeProfileForm";
import { BasicDataForm } from "./BasicDataForm";

interface Props {
  profile: IDistributorUser;
}

export function Account({ profile }: Props) {
  if (!profile) return <></>;

  const t = useTranslations();

  return (
    <section className="px-4 py-6" id="account-container">
      <div className="flex justify-between py-4" id="header">
        <h2 id="title" className="text-4xl">
          {t("profile_title_my_data")}
        </h2>

        <h3 id="rrss" className="text-4xl">
          {t("profile_title_ssnn")}
        </h3>
      </div>

      <BasicDataForm profile={profile} />
      <SecretDataForm />
      {/* <LocationForm profile_location={profile.profile_location} /> */}
      <CustomizeProfileForm profile={profile} />
    </section>
  );
}

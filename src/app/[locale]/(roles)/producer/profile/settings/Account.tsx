"use client";

import { useTranslations } from "next-intl";
import { IProducerUser } from "../../../../../../lib/types";
import { BasicDataForm } from "./BasicDataForm";
import { SecretDataForm } from "./SecretDataForm";

interface Props {
  profile: IProducerUser;
}

export function Account({ profile }: Props) {
  if (!profile) return <></>;

  const t = useTranslations();

  return (
    <section className="px-4 py-6" id="account-container">
      <div className="flex justify-between py-4" id="header">
        <h2 id="title" className="text-5xl uppercase font-semibold text-white">
          {t("profile_title_my_data")}
        </h2>
      </div>

      <BasicDataForm profile={profile} />
      <SecretDataForm />
      {/* <LocationForm profile_location={profile.profile_location} /> */}
    </section>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "../../../../Auth/useAuth";
import { SupabaseProps } from "../../../../../../constants";
import { isValidObject } from "../../../../../../utils/utils";
import { Button } from "../../../../components/common/Button";
import { Spinner } from "../../../../components/common/Spinner";
import { IDistributorUser } from "../../../../../../lib/types";
import { useAppContext } from "../../../../../../../context/AppContext";
import { FilePreviewAndHide } from "../../../../components/common/FilePreviewAndHide";

type FormValues = {
  bg_url: any;
  avatar_url: any;
  profile_photo_url: any;
};

interface Props {
  profile: IDistributorUser;
}

export function CustomizeProfileForm({ profile }: Props) {
  const t = useTranslations();
  const { supabase } = useAuth();

  const [loading, setLoading] = useState(false);

  const { bgImg, profileImg, setBgImg, setProfileImg } = useAppContext();

  const [userBgImg, setUserBgImg] = useState(bgImg);
  const [userProfileImg, setUserProfileImg] = useState(profileImg);

  const form = useForm({
    defaultValues: {
      bg_url: SupabaseProps.CUSTOM_BG_URL + profile.user ?? "",
      avatar_url: SupabaseProps.BASE_AVATARS_URL + profile.user ?? "",
      profile_photo_url: SupabaseProps.PROFILE_PHOTO_URL + profile.user ?? "",
    },
  });

  const { handleSubmit } = form;

  const customUrl = `${SupabaseProps.CUSTOM_BG_URL}`;
  const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;
  const fullCustomUrl = `${SupabaseProps.BASE_AVATARS_URL}${customUrl}`;
  const fullProfilePhotoUrl = `${SupabaseProps.BASE_AVATARS_URL}${profilePhotoUrl}`;

  const onSubmit = async (formValues: FormValues) => {
    setLoading(true);

    const { bg_url, profile_photo_url } = formValues;

    if (isValidObject(bg_url.name)) {
      if (bg_url.size > 0) {
        // TODO: Actualizar aquí la URL de APP CONTEXT de Custom IMG y Profile IMG para que pueda estar sincronizado.

        const encodeUriCustomImg = encodeURIComponent(
          `${SupabaseProps.CUSTOM_BG_URL}${profile.user}`
        );

        const { error: errorDelete } = await supabase.storage
          .from("avatars")
          .remove([encodeUriCustomImg]);

        if (errorDelete) {
          setLoading(false);
          throw errorDelete;
        }

        const { error: storageError } = await supabase.storage
          .from("avatars")
          .upload(encodeUriCustomImg, bg_url, {
            upsert: true,
            cacheControl: "0",
          });

        if (storageError) {
          setLoading(false);
          throw storageError;
        }

        setUserBgImg(`${fullCustomUrl}${profile?.user}`);
      }
    }

    if (isValidObject(profile_photo_url.name)) {
      if (profile_photo_url.size > 0) {
        // const encodeUriProfileImg = encodeURIComponent(`${profileUrl}${profile?.id}`);
        const encodeUriProfileImg = encodeURIComponent(
          `${SupabaseProps.PROFILE_PHOTO_URL}${profile.user}`
        );

        const { error: errorDelete } = await supabase.storage
          .from("avatars")
          .remove([encodeUriProfileImg]);

        if (errorDelete) {
          setLoading(false);
          throw errorDelete;
        }

        const { error: storageError } = await supabase.storage
          .from("avatars")
          .upload(encodeUriProfileImg, profile_photo_url, {
            upsert: true,
            cacheControl: "0",
          });

        if (storageError) {
          setLoading(false);

          throw storageError;
        }

        setUserProfileImg(`${fullProfilePhotoUrl}${profile.user}/img`);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    setBgImg(userBgImg ?? `/icons/bg-240.png`);
  }, [setBgImg, userBgImg]);

  useEffect(() => {
    setProfileImg(userProfileImg ?? `/icons/profile-240.png`);
  }, [setProfileImg, userProfileImg]);

  return (
    <section className="mb-4 space-y-3 bg-white px-6 py-4">
      <div id="account-data" className="text-2xl">
        {t("profile_custom")}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-2">
        <div className="flex flex-row items-end space-x-3">
          <div className="w-full">
            <label htmlFor="bg_img" className="text-sm text-gray-600">
              {t("profile_custom_bg_img")}
            </label>

            <FilePreviewAndHide
              storagePath="avatars"
              form={form}
              registerName={"bg_url"}
            />
          </div>

          <div className="w-full ">
            <label
              htmlFor="profile_photo_img"
              className="text-sm text-gray-600"
            >
              {t("profile_custom_profile_photo_img")}
            </label>

            <FilePreviewAndHide
              storagePath="avatars"
              form={form}
              registerName={"profile_photo_url"}
            />
          </div>
        </div>

        {loading && (
          <Spinner color="beer-blonde" size={"xLarge"} absolute center />
        )}

        <Button primary medium btnType={"submit"} disabled={loading}>
          {t("save")}
        </Button>
      </form>
    </section>
  );
}

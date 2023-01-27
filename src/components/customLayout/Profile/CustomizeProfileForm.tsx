import { User } from "@supabase/supabase-js";
import { Button } from "@supabase/ui";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SupabaseProps } from "../../../constants";
import { supabase } from "../../../utils/supabaseClient";
import { useAppContext } from "../../Context/AppContext";
import { Spinner } from "../../common/Spinner";

type FormValues = {
  bg_url: any;
  avatar_url: any;
  profile_photo_url: any;
};

interface Props {
  user: User | null;
}

export default function CustomizeProfileForm(props: Props) {
  const { t } = useTranslation();

  const { user } = props;
  const [loading, setLoading] = useState(false);

  const { setBgImg, setProfileImg } = useAppContext();

  const mockPng = new File([""], "", { type: "image/png" });
  const mockFileList = [mockPng];

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      bg_url: mockFileList,
      avatar_url: mockFileList,
      profile_photo_url: mockFileList,
    },
  });

  const customUrl = `${SupabaseProps.CUSTOM_BG_URL}`;
  const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;
  const fullCustomUrl = `${SupabaseProps.BASE_AVATARS_URL}${customUrl}`;
  const fullProfilePhotoUrl = `${SupabaseProps.BASE_AVATARS_URL}${profilePhotoUrl}`;

  const onSubmit = async (formValues: FormValues) => {
    try {
      setLoading(true);

      const { bg_url, profile_photo_url } = formValues;

      const { error: profileError } = await supabase
        .from("users")
        .update({
          bg_url: bg_url[0].name,
          profile_photo_url: profile_photo_url[0].name,
        })
        .eq("id", user?.id);

      if (profileError) {
        setLoading(false);
        throw profileError;
      }

      if (bg_url[0].size > 0) {
        const encodeUriCustomImg = encodeURIComponent(
          `${customUrl}${user?.id}/img`
        );

        const { error: storageError } = await supabase.storage
          .from("avatars")
          .upload(encodeUriCustomImg, bg_url[0], {
            upsert: true,
            cacheControl: "0",
          });

        if (storageError) {
          setLoading(false);
          throw storageError;
        }

        setBgImg(`${fullCustomUrl}${user?.id}/img`);
      }

      if (profile_photo_url[0].size > 0) {
        const encodeUriProfileImg = encodeURIComponent(
          `${profilePhotoUrl}${user?.id}/img`
        );

        const { error: storageError } = await supabase.storage
          .from("avatars")
          .upload(encodeUriProfileImg, profile_photo_url[0], {
            upsert: true,
            cacheControl: "0",
          });

        if (storageError) {
          setLoading(false);
          throw storageError;
        }

        setProfileImg(`${fullProfilePhotoUrl}${user?.id}/img`);
      }

      setLoading(false);
    } catch (error) {
      alert("Error updating the data!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container px-6 py-4 bg-white space-y-3 mb-4">
      <div id="account-data" className="text-2xl">
        {t("profile_custom")}
      </div>

      {!loading ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row items-end">
            <div className="w-full">
              <label htmlFor="bg_img" className="text-sm text-gray-600">
                {t("profile_custom_bg_img")}
              </label>

              <input
                type="file"
                {...register("bg_url", {
                  required: false,
                })}
                accept="image/png, image/jpeg"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="profile_photo_img"
                className="text-sm text-gray-600"
              >
                {t("profile_custom_profile_photo_img")}
              </label>

              <input
                type="file"
                {...register("profile_photo_url", {
                  required: false,
                })}
                accept="image/png, image/jpeg"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="pl-12 ">
              <Button type="primary" size="medium">
                {t("save")}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Spinner />
      )}
    </section>
  );
}

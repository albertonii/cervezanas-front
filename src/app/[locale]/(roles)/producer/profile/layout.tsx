"use client";

import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "../../../Auth/useAuth";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Sidebar } from "../../../components/common/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { COMMON, SupabaseProps } from "../../../../../constants";
import { useAppContext } from "../../../../context/AppContext";

type LayoutProps = {
  children: React.ReactNode;
};

const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;

export default function layout({ children }: LayoutProps) {
  const t = useTranslations();
  const sidebarLinks = [
    {
      name: t("profile"),
      icon: "user",
      option: "settings",
    },
    {
      name: t("products"),
      icon: "box",
      option: "products",
    },
    {
      name: t("distributors_associated"),
      icon: "truck",
      option: "distributors_associated",
    },
    {
      name: t("campaigns"),
      icon: "gift",
      option: "campaigns",
    },
    {
      name: t("events"),
      icon: "location",
      option: "events",
    },
    {
      name: t("consumption_points"),
      icon: "location",
      option: "consumption_points",
    },
    {
      name: t("online_orders"),
      icon: "shopping-cart",
      option: "online_orders",
    },
    {
      name: t("event_orders"),
      icon: "shopping-cart",
      option: "event_orders",
    },

    {
      name: t("reviews"),
      icon: "review",
      option: "reviews",
    },
    {
      name: t("notifications"),
      icon: "bell",
      option: "notifications",
    },
  ];

  const { user, supabase } = useAuth();

  const { bgImg, profileImg, setProfileImg } = useAppContext();

  const [bgImg_, setBgImg_] = useState(bgImg ?? COMMON.BG_IMG);
  const [profileImg_, setProfileImg_] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updateProfile = async (file: File) => {
      const encodeUriProfileImg = encodeURIComponent(
        `${profilePhotoUrl}${user?.id}/img`
      );
      const decodeUriProfileImg = decodeURIComponent(
        `${profilePhotoUrl}${user?.id}/img`
      );

      const { error: errorDelete } = await supabase.storage
        .from("avatars")
        .remove([encodeUriProfileImg]);

      if (errorDelete) {
        console.error("errorDelete", errorDelete);
        return;
      }

      const { error } = await supabase.storage
        .from("avatars")
        .upload(encodeUriProfileImg, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("error", error);
        return;
      }

      const { error: errorProfileImg } = await supabase
        .from("users")
        .update({ avatar_url: decodeUriProfileImg })
        .eq("id", user?.id);

      if (errorProfileImg) {
        console.error("errorProfileImg update", errorProfileImg);
        return;
      }

      setProfileImg(SupabaseProps.BASE_AVATARS_URL + decodeUriProfileImg);
    };

    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }

    updateProfile(fileObj);
    event.target.files = null;
  };

  useEffect(() => {
    setBgImg_(bgImg ?? COMMON.BG_IMG);
  }, [bgImg]);

  useEffect(() => {
    setProfileImg_(profileImg ?? COMMON.PROFILE_IMG);
  }, [profileImg]);

  return (
    <section className="relative flex w-full">
      <Sidebar sidebarLinks={sidebarLinks} />

      <div className="h-full w-full">
        {bgImg_ && profileImg_ && (
          <>
            {/* Background Image */}
            <section className="bg-bear-alvine " aria-label="Custom Header">
              <Image
                className="max-h-[20vh] w-full object-cover md:max-h-[40vh]"
                width={1260}
                height={240}
                src={"/assets/producer_layout.jpg"}
                alt={"background custom image"}
                // onError={() => setBgImg_(COMMON.BG_IMG)}
              />

              {/* Profile Image */}
              <section
                className=" absolute bottom-20 w-64 space-x-2 pl-24"
                aria-label="Logo"
              >
                <figure className="relative" onClick={() => handleClick()}>
                  <Image
                    className="absolute h-36 w-36 rounded-full"
                    src={profileImg_}
                    alt=""
                    width={240}
                    height={240}
                    loader={() => profileImg_}
                  />

                  <span className="group absolute flex h-36 w-36 cursor-pointer items-center justify-center rounded-full opacity-60 transition duration-500 hover:bg-gray-200">
                    <FontAwesomeIcon
                      icon={faUpload}
                      style={{ color: "bear-dark" }}
                      // onMouseEnter={() => setHoverColor("filled")}
                      // onMouseLeave={() => setHoverColor("unfilled")}
                      title={"profile"}
                      width={60}
                      height={60}
                    />
                    <input
                      style={{ display: "none" }}
                      ref={inputRef}
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                    />
                  </span>
                </figure>
              </section>
            </section>

            <div
              className="w-full bg-beer-softFoam sm:pt-[5vh] md:pt-[5vh]"
              aria-label="Container Producer settings"
            >
              {children}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

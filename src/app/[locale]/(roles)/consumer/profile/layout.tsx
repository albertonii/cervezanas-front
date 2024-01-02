"use client";

import Image from "next/image";
import DisplayImageProfile from "../../../components/common/DisplayImageProfile";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../Auth/useAuth";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { COMMON, SupabaseProps } from "../../../../../constants";
import { useAppContext } from "../../../../../../context/AppContext";
import { useTranslations } from "next-intl";
import { Sidebar } from "../../../components/common/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;

export default function layout({ children }: LayoutProps) {
  const t = useTranslations();

  const { user, supabase } = useAuth();

  const { bgImg, profileImg, setProfileImg } = useAppContext();
  const [bgImg_, setBgImg_] = useState(bgImg ?? COMMON.BG_IMG);
  const [profileImg_, setProfileImg_] = useState("");

  const bg = "/assets/producer_layout.jpg";

  const inputRef = useRef<HTMLInputElement>(null);

  const sidebarLinks = [
    {
      name: t("profile"),
      icon: "user",
      option: "settings",
    },
    {
      name: t("event_orders"),
      icon: "shopping-cart",
      option: "event_orders",
    },
    {
      name: t("online_orders"),
      icon: "shopping-cart",
      option: "orders",
    },
    {
      name: t("reviews"),
      icon: "review",
      option: "reviews",
    },
    {
      name: t("watchlist"),
      icon: "watchlist",
      option: "likes_history",
    },
  ];

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
    console.log(profileImg);
    setProfileImg_(profileImg ?? COMMON.PROFILE_IMG);
  }, [profileImg]);

  return (
    <section className="relative flex w-full">
      <Sidebar sidebarLinks={sidebarLinks} />

      <div className="h-full w-full">
        {bgImg_ && profileImg_ && (
          <>
            {/* Background Image */}
            <div className=" bg-bear-alvine " aria-label="Custom Header">
              <Image
                className="max-h-[20vh] w-full object-cover md:max-h-[40vh]"
                width={1260}
                height={240}
                src={bgImg_ ?? bg}
                // onError={() => setBgImg_(COMMON.BG_IMG)}
                alt={"background custom image"}
                loader={() => bgImg_ ?? bg}
              />

              {/* Profile Image */}
              <div className="relative space-x-2 pl-24" aria-label="Logo">
                <div className="absolute bottom-20">
                  <div className="w-64  ">
                    <div className="relative" onClick={() => handleClick()}>
                      <DisplayImageProfile
                        imgSrc={profileImg_}
                        class={"absolute h-36 w-36 rounded-full"}
                      />

                      <div className="group absolute flex h-36 w-36 cursor-pointer items-center justify-center rounded-full opacity-60 transition duration-500 hover:bg-gray-200">
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="w-full bg-beer-softFoam sm:pt-[5vh] md:pt-[5vh]"
              aria-label="Container Consumer settings"
            >
              {children}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useUser } from "../Auth/UserContext";

type Props = {
  children: JSX.Element;
};

export const ClientContainerLayout = ({ children }: Props) => {
  const { user } = useUser();

  const [userProfile, setUserProfile] = useState<any[]>();
  const [bgImg, setBgImg] = useState({ publicURL: "" });
  const [profilePhoto, setProfilePhoto] = useState({ publicURL: "" });

  useEffect(() => {
    if (user != null) {
      const getUserProfile = async () => {
        const { data, error } = await supabase
          .from("users")
          .select("bg_url, profile_photo_url")
          .eq("id", user!.id);
        if (error) throw error;
        setUserProfile(data);
      };

      getUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      const getBg = async () => {
        if (userProfile![0].bg_url != null) {
          const decodeUriImg = `custom_bg/${user?.id}/img`;

          const { data: bgImgData, error } = await supabase.storage
            .from("avatars")
            .getPublicUrl(decodeUriImg);

          if (error) throw error;

          setBgImg(bgImgData!);
        }
      };

      const getProfilePhoto = async () => {
        if (userProfile![0].profile_photo_url != null) {
          const decodeUriImg = `profile_photo/${user?.id}/img`;
          console.log(decodeUriImg);

          const { data: profilePhotoData, error } = await supabase.storage
            .from("avatars")
            .getPublicUrl(decodeUriImg);

          if (error) throw error;

          setProfilePhoto(profilePhotoData!);
        }
      };

      getBg();
      getProfilePhoto();
    }
  }, [userProfile, user]);

  return (
    <>
      <div className="container ">
        <div className=" bg-red-200" aria-label="Custom Header">
          <div className="">
            <Image
              className="max-h-[40vh] w-full object-cover"
              width={1260}
              height={240}
              src={bgImg.publicURL}
              alt={""}
            />
          </div>

          <div className="space-x-2 relative pl-24" aria-label="Logo">
            <div className="object-bottom -bottom-10 absolute">
              <Image
                width={150}
                height={150}
                className="rounded-full h-36 w-36 border  bg-indigo-100 mx-auto 
                  shadow-2xl inset-x-0 top-0 flex items-center justify-center text-indigo-500"
                src={profilePhoto.publicURL}
                alt="profile image"
              />
            </div>
          </div>
        </div>
        <div className="bg-blue-200 " aria-label="Container Client Information">
          {children}
        </div>
      </div>
    </>
  );
};

import Image from "next/image";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SupabaseProps } from "../../constants";
import { supabase } from "../../utils/supabaseClient";
import { useAppContext } from "../Context/AppContext";
import { User } from "../../lib/interfaces";

type Props = {
  children: JSX.Element;
  user: User;
  role: string;
};

const profilePhotoUrl = `${SupabaseProps.PROFILE_PHOTO_URL}`;

export function ClientContainerLayout({ children, user, role }: Props) {
  const { bgImg, profileImg, setProfileImg } = useAppContext();

  const [bgImg_, setBgImg_] = useState(bgImg);
  const [profileImg_, setProfileImg_] = useState(bgImg);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    // 👇️ open file input box on click of other element
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
    setBgImg_(bgImg);
  }, [bgImg]);

  useEffect(() => {
    setProfileImg_(profileImg);
  }, [profileImg]);

  return (
    <>
      <div className="w-full h-[90vh]">
        {role === "admin" && (
          <>
            {/* Client Information */}
            <div
              className="bg-beer-softFoam h-full pt-[5vh] md:pt-[5vh] sm:"
              aria-label="Container Client Information"
            >
              {children}
            </div>
          </>
        )}

        {role === "producer" && bgImg_ && profileImg_ && (
          <>
            {/* Background Image */}
            <div className=" bg-bear-alvine " aria-label="Custom Header">
              <Image
                className="max-h-[20vh] md:max-h-[40vh] w-full object-cover"
                width={1260}
                height={240}
                src={bgImg_}
                alt={"background custom image"}
              />

              {/* Profile Image */}
              <div className="space-x-2 relative pl-24" aria-label="Logo">
                <div className="bottom-20 absolute">
                  <div className="w-64  ">
                    <div className="relative" onClick={() => handleClick()}>
                      <Image
                        className="w-36 h-36 rounded-full absolute"
                        src={profileImg_}
                        alt=""
                        width={240}
                        height={240}
                      />

                      <div className="w-36 h-36 group hover:bg-gray-200 opacity-60 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500">
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

            {/* Client Information */}
            <div
              className="bg-beer-softFoam h-full pt-[5vh] md:pt-[5vh] sm:"
              aria-label="Container Client Information"
            >
              {children}
            </div>
          </>
        )}
      </div>
    </>
  );
}

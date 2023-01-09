import Image from "next/image";
import { useProfile } from "../Context/ProfileContext";

type Props = {
  children: JSX.Element;
};

export const ClientContainerLayout = ({ children }: Props) => {
  const { bgImg, profileImg } = useProfile();

  return (
    <>
      {bgImg && profileImg ? (
        <div className="container ">
          <div className=" bg-red-200" aria-label="Custom Header">
            <div className="">
              <Image
                className="max-h-[40vh] w-full object-cover"
                width={1260}
                height={240}
                src={bgImg!}
                alt={"background custom image"}
              />
            </div>

            <div className="space-x-2 relative pl-24" aria-label="Logo">
              <div className="object-bottom -bottom-10 absolute">
                <Image
                  width={150}
                  height={150}
                  className="rounded-full h-36 w-36 border  bg-indigo-100 mx-auto 
                  shadow-2xl inset-x-0 top-0 flex items-center justify-center text-indigo-500"
                  src={profileImg!}
                  alt={"profile image"}
                />
              </div>
            </div>
          </div>
          <div
            className="bg-blue-200 "
            aria-label="Container Client Information"
          >
            {children}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

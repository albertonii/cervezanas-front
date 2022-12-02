import Image from "next/image";

type Props = {
  children: JSX.Element;
};

export const ClientContainerLayout = ({ children }: Props) => {
  return (
    <>
      <div className="container ">
        <div className="h-[20vh] bg-red-200" aria-label="Custom Header">
          <div className="h-[25vh] space-x-2 relative pl-24 " aria-label="Logo">
            Background
            <div className="object-bottom absolute bottom-0">
              <Image
                width={150}
                height={150}
                className="rounded-full border border-gray-100 shadow-sm"
                src="https://randomuser.me/api/portraits/women/32.jpg"
                alt="user image"
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

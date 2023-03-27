import Image from "next/image";
import React from "react";

interface Props {
  file?: any;
}

const FilePreview = ({ file }: Props) => {
  if (!file) {
    return null;
  }

  return (
    <div className=" overflow-hidden relative shadow-md border-2 items-center border-gray-400 border-dotted w-[80px] h-[50px] rounded-md">
      <div className="relative h-full w-full bg-gray-200 z-1 flex justify-center items-center">
        <div className="">
          <Image
            width={64}
            height={64}
            className="w-full h-full rounded"
            src={URL.createObjectURL(file)}
            alt={""}
          />
        </div>
      </div>
    </div>
  );
};

export default FilePreview;

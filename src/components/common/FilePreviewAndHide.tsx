"use client";

import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { SupabaseProps } from "../../constants";
import { isValidObject } from "../../utils/utils";

interface Props {
  form: UseFormReturn<any, any>;
  registerName: string;
  storagePath: string;
}

export const FilePreviewAndHide = ({
  form: { setValue, getValues, register },
  registerName,
  storagePath,
}: Props) => {
  const t = useTranslations();

  const [fileList, setFileList] = useState<FileList | null>(
    getValues(registerName)?.size > 0 ? getValues(registerName) : null
  );
  const [message, setMessage] = useState("");
  const [hideDrop, setHideDrop] = useState(
    getValues(registerName)?.size > 0 ? true : false
  );
  const [existsPrevImg, setExistsPrevImg] = useState(
    isValidObject(getValues(registerName))
  );

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return console.info("No hay archivos");

    setFileList(e.target.files);
    setMessage("");
  };

  useEffect(() => {
    if (fileList && fileList.length > 0) {
      setHideDrop(true);
      setValue(registerName, fileList);
    } else setHideDrop(false);
  }, [fileList, registerName, setValue]);

  const removeImage = () => {
    setFileList(null);
    setExistsPrevImg(false);
  };

  useEffect(() => {
    if (existsPrevImg) setHideDrop(true);
  }, [existsPrevImg]);

  return (
    <div className="w-[360px] rounded-md md:w-4/5 lg:w-full">
      <span className="mb-1 flex items-center justify-center bg-white text-[12px] text-red-500">
        {message}
      </span>

      {hideDrop && fileList ? (
        <div className="relative h-32 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 border-dotted   border-gray-400 shadow-md">
          <div className="z-1 relative flex h-full  w-full items-center justify-center bg-gray-200">
            <div className="flex flex-row items-center gap-2">
              <div className="h-32 ">
                {existsPrevImg ? (
                  <Image
                    width={128}
                    height={128}
                    className="h-full w-full rounded"
                    src={`${
                      storagePath === "products"
                        ? SupabaseProps.BASE_PRODUCTS_URL
                        : SupabaseProps.BASE_AVATARS_URL
                    }${getValues(registerName)}`}
                    alt={""}
                  />
                ) : (
                  <Image
                    width={128}
                    height={128}
                    className="h-full w-full rounded"
                    src={URL.createObjectURL(fileList[0])}
                    alt={""}
                  />
                )}
              </div>
            </div>

            <div
              onClick={() => {
                removeImage();
              }}
              className="absolute top-0 right-0 mr-1 mt-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm bg-red-400 object-right-top"
            >
              <i className="mdi mdi-trash-can text-[16px] text-white">x</i>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-32 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 border-dotted   border-gray-400 shadow-md">
          <input
            {...register(registerName)}
            type="file"
            onChange={handleFile}
            accept="image/png, image/jpeg"
            className="absolute z-10 h-full w-full opacity-0"
          />

          <div className="z-1 absolute top-0 flex h-full w-full items-center justify-center bg-gray-200">
            <div className="flex flex-col px-2">
              <i className="mdi mdi-folder-open text-center text-[30px] text-gray-400"></i>
              <span className="text-[12px]">{t("drag_and_drop_file")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

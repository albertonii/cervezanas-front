import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Props {
  form: UseFormReturn<any, any>;
  registerName: string;
}

export const FilePreviewProductMultimedia = ({
  form: { register, setValue },
  registerName,
}: Props) => {
  const { t } = useTranslation();

  //TODO: Cambiar el tipo de File de any a File
  const [file, setFile] = useState<any>(new File([], ""));
  const [message, setMessage] = useState("");
  const [hideDrop, setHideDrop] = useState(false);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files![0];
    setFile(file);
    setMessage("");
  };

  useEffect(() => {
    if (file.size !== 0) {
      setHideDrop(true);

      switch (registerName) {
        case "p_principal":
          setValue("p_principal", file);
          break;
        case "p_back":
          setValue("p_back", file);
          break;
        case "p_extra_1":
          setValue("p_extra_1", file);
          break;
        case "p_extra_2":
          setValue("p_extra_2", file);
          break;
        case "p_extra_3":
          setValue("p_extra_3", file);
          break;
        default:
          break;
      }
    } else setHideDrop(false);
  }, [file, registerName, setValue]);

  const removeImage = () => {
    setFile(new File([], ""));
  };

  return (
    <div className="flex justify-center items-center w-full ">
      <div className=" md:w-4/5 w-[360px] rounded-md">
        <span className="flex justify-center items-center bg-white text-[12px] mb-1 text-red-500">
          {message}
        </span>

        {!hideDrop ? (
          <div className="h-32 w-full overflow-hidden relative shadow-md border-2 items-center rounded-md cursor-pointer   border-gray-400 border-dotted">
            <input
              type="file"
              onChange={handleFile}
              accept="image/png, image/jpeg"
              className="h-full w-full opacity-0 z-10 absolute"
            />

            <input
              {...register("p_back", { required: "false" })}
              type="file"
              onChange={handleFile}
              accept="image/png, image/jpeg"
              className="h-full w-full opacity-0 z-10 absolute"
            />

            <input
              {...register("p_extra_1", { required: "false" })}
              type="file"
              onChange={handleFile}
              accept="image/png, image/jpeg"
              className="h-full w-full opacity-0 z-10 absolute"
            />

            <input
              {...register("p_extra_2", { required: "false" })}
              type="file"
              onChange={handleFile}
              accept="image/png, image/jpeg"
              className="h-full w-full opacity-0 z-10 absolute"
            />

            <input
              {...register("p_extra_3", { required: "false" })}
              type="file"
              onChange={handleFile}
              accept="image/png, image/jpeg"
              className="h-full w-full opacity-0 z-10 absolute"
            />

            <div className="h-full w-full bg-gray-200 absolute z-1 flex justify-center items-center top-0">
              <div className="flex flex-col px-2">
                <i className="mdi mdi-folder-open text-[30px] text-gray-400 text-center"></i>
                <span className="text-[12px]">{t("drag_and_drop_file")}</span>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {hideDrop ? (
          <div className="h-32 w-full overflow-hidden relative shadow-md border-2 items-center rounded-md cursor-pointer   border-gray-400 border-dotted">
            <div className="relative h-full w-full bg-gray-200  z-1 flex justify-center items-center">
              <div className="flex flex-row items-center gap-2">
                <div className="h-32">
                  <Image
                    width={128}
                    height={128}
                    className="w-full h-full rounded"
                    src={URL.createObjectURL(file)}
                    alt={""}
                  />
                </div>
              </div>

              <div
                onClick={() => {
                  removeImage();
                }}
                className="absolute top-0 right-0 object-right-top h-6 w-6 mr-1 mt-1 bg-red-400 flex items-center cursor-pointer justify-center rounded-sm"
              >
                <i className="mdi mdi-trash-can text-white text-[16px]">x</i>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
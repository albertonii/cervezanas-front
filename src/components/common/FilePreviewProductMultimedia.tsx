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
    if (e.target.files === null) return console.info("No hay archivos");

    const file = e.target.files[0];
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
    <div className="flex w-full items-center justify-center ">
      <div className=" w-[360px] rounded-md md:w-4/5">
        <span className="mb-1 flex items-center justify-center bg-white text-[12px] text-red-500">
          {message}
        </span>

        {!hideDrop ? (
          <div className="relative h-32 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 border-dotted   border-gray-400 shadow-md">
            <input
              type="file"
              onChange={handleFile}
              accept="image/png, image/jpeg"
              className="absolute z-10 h-full w-full opacity-0"
            />

            <input
              {...register("p_back", { required: "false" })}
              type="file"
              onChange={handleFile}
              accept="image/png, image/jpeg"
              className="absolute z-10 h-full w-full opacity-0"
            />

            <input
              {...register("p_extra_1", { required: "false" })}
              type="file"
              onChange={handleFile}
              accept="image/png, image/jpeg"
              className="absolute z-10 h-full w-full opacity-0"
            />

            <input
              {...register("p_extra_2", { required: "false" })}
              type="file"
              onChange={handleFile}
              accept="image/png, image/jpeg"
              className="absolute z-10 h-full w-full opacity-0"
            />

            <input
              {...register("p_extra_3", { required: "false" })}
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
        ) : (
          <></>
        )}

        {hideDrop ? (
          <div className="relative h-32 w-full cursor-pointer items-center overflow-hidden rounded-md border-2 border-dotted   border-gray-400 shadow-md">
            <div className="z-1 relative flex h-full  w-full items-center justify-center bg-gray-200">
              <div className="flex flex-row items-center gap-2">
                <div className="h-32">
                  <Image
                    width={128}
                    height={128}
                    className="h-full w-full rounded"
                    src={URL.createObjectURL(file)}
                    alt={""}
                  />
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
          <></>
        )}
      </div>
    </div>
  );
};

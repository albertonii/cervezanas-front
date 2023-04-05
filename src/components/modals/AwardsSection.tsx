import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Divider } from "@supabase/ui";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useEffect, useState } from "react";
import { Award, ModalAddProductProps } from "../../lib/types";
import { Button, DeleteButton } from "../common";
import { FilePreviewAndHide } from "../common/FilePreviewAndHide";

const emptyAward: Award = {
  id: "",
  name: "",
  description: "",
  img_url: "",
  year: 2023,
  beer_id: "",
};

interface Props {
  form: UseFormReturn<ModalAddProductProps, any>;
}

interface FileProps {
  index: number;
  file: File;
}

export const AwardsSection = ({ form }: Props) => {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    name: "awards",
    control,
  });

  const [selectedFiles, setSelectedFiles] = useState<FileProps[]>([]);

  useEffect(() => {
    selectedFiles.map((file) => {
      let src = URL.createObjectURL(file.file);

      let preview = document.getElementById(
        `prev-img-${file.index}`
      ) as HTMLImageElement | null;

      if (preview !== null) {
        preview.src = src;
        preview.style.display = "block";
      }
    });
  }, [selectedFiles]);

  const handleRemoveAward = (index: number) => {
    setSelectedFiles((current) =>
      current.filter((selectedFile) => selectedFile.index !== index)
    );
    remove(index);
  };

  const handleAddAward = () => {
    append(emptyAward);
  };

  return (
    <section id="Award">
      {fields.map((field, index) => (
        <div key={field.id} className="relative pt-6 flex-auto space-y-4">
          <div className="flex flex-row items-end">
            <div className="w-full space-y">
              <label htmlFor="award_name" className="text-sm text-gray-600">
                <b>{index + 1} </b> {t("name")}
              </label>

              <input
                type="text"
                id="award_name"
                placeholder={t("input_product_award_name_placeholder")!}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register(`awards.${index}.name`, {
                  required: false,
                })}
              />
              {`errors.awards.${index}.name.type` === "required" && (
                <p>{t("input_required")}</p>
              )}
              {`errors.awards.${index}.name.type` === "maxLength" && (
                <p>{t("product_modal_20_max_length")}</p>
              )}
            </div>

            <div className="ml-4">
              {fields.length > 1 && (
                <DeleteButton onClick={() => handleRemoveAward(index)} />
              )}
            </div>
          </div>

          <div className="w-full space-y">
            <label
              htmlFor="award_description"
              className="text-sm text-gray-600"
            >
              {t("description")}
            </label>

            <input
              type="text"
              id="award_description"
              placeholder={t("input_product_award_description_placeholder")!}
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register(`awards.${index}.description`, {
                required: false,
              })}
            />
            {`errors.awards.${index}.description.type` === "required" && (
              <p>{t("input_required")}</p>
            )}
            {`errors.awards.${index}.description.type` === "maxLength" && (
              <p>{t("product_modal_20_max_length")}</p>
            )}
          </div>

          <div className="w-full space-y">
            <label htmlFor="award_year" className="text-sm text-gray-600">
              {t("year")}
            </label>

            <input
              type="number"
              id="award_year"
              placeholder={t("input_product_award_year_placeholder")!}
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              value="2021"
              {...register(`awards.${index}.year`, {
                required: false,
                valueAsNumber: true,
              })}
            />
            {`errors.awards.${index}.year.type` === "required" && (
              <p>{t("input_required")}</p>
            )}
          </div>

          <div className="w-full space-y">
            <label htmlFor="award_img_url" className="text-sm text-gray-600">
              {t("upload_img_url")}
            </label>

            <FilePreviewAndHide
              storagePath="products/awards"
              form={form}
              registerName={`awards.${index}.img_url`}
            />

            {`errors.awards.${index}.img_url.type` === "required" && (
              <p>{t("input_required")}</p>
            )}
          </div>

          <Divider className="my-6" />
        </div>
      ))}

      <div>
        <Button class="" primary medium onClick={() => handleAddAward()}>
          {t("modal_product_award_add")}
        </Button>
      </div>
    </section>
  );
};

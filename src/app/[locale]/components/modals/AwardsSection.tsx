import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Divider } from "@supabase/ui";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { IAward, ModalAddProductProps } from "../../../../lib/types";
import {
  Button,
  DeleteButton,
  DisplayInputError,
  FilePreviewImageMultimedia,
} from "../common";

const emptyAward: IAward = {
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
  const { control, register } = form;

  const t = useTranslations();

  const { fields, append, remove } = useFieldArray({
    name: "awards",
    control,
  });

  const [selectedFiles, setSelectedFiles] = useState<FileProps[]>([]);

  useEffect(() => {
    selectedFiles.map((file) => {
      const src = URL.createObjectURL(file.file);

      const preview = document.getElementById(
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
        <div key={field.id} className="relative flex-auto space-y-4 pt-6">
          <div className="flex flex-row items-end">
            <div className="space-y w-full">
              <label htmlFor="award_name" className="text-sm text-gray-600">
                <b>{index + 1} </b> {t("name")}
              </label>

              <input
                type="text"
                id="award_name"
                placeholder={t("input_product_award_name_placeholder")}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                {...register(`awards.${index}.name`, {
                  required: false,
                })}
              />
              {`errors.awards.${index}.name.type` === "required" && (
                <DisplayInputError message="errors.input_required" />
              )}
              {`errors.awards.${index}.name.type` === "maxLength" && (
                <DisplayInputError message="errors.product_modal_20_max_length" />
              )}
            </div>

            <div className="ml-4">
              <DeleteButton onClick={() => handleRemoveAward(index)} />
            </div>
          </div>

          <div className="space-y w-full">
            <label
              htmlFor="award_description"
              className="text-sm text-gray-600"
            >
              {t("description")}
            </label>

            <input
              type="text"
              id="award_description"
              placeholder={t("description")}
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              {...register(`awards.${index}.description`, {
                required: false,
              })}
            />
            {`errors.awards.${index}.description.type` === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
            {`errors.awards.${index}.description.type` === "maxLength" && (
              <DisplayInputError message="errors.product_modal_20_max_length" />
            )}
          </div>

          <div className="space-y w-full">
            <label htmlFor="award_year" className="text-sm text-gray-600">
              {t("year")}
            </label>

            <input
              type="number"
              id="award_year"
              placeholder={t("input_product_award_year_placeholder")}
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              defaultValue={2021}
              {...register(`awards.${index}.year`, {
                required: false,
                valueAsNumber: true,
              })}
            />
            {`errors.awards.${index}.year.type` === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </div>

          <div className="space-y w-full">
            <label htmlFor="award_img_url" className="text-sm text-gray-600">
              {t("upload_img_url")}
            </label>

            <FilePreviewImageMultimedia
              form={form}
              registerName={`awards.${index}.img_url`}
            />

            {`errors.awards.${index}.img_url.type` === "required" && (
              <DisplayInputError message="errors.input_required" />
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

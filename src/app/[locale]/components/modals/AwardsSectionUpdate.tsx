import { UseFormReturn, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { IAward } from "../../../../lib/types";
import { Button } from "../common/Button";
import { DisplayInputError } from "../common/DisplayInputError";
import { FilePreviewImageMultimedia } from "../common/FilePreviewImageMultimedia";
import { SupabaseProps } from "../../../../constants";
import InputLabel from "../common/InputLabel";
import { DeleteButton } from "../common/DeleteButton";

const emptyAward: IAward = {
  id: "",
  name: "",
  description: "",
  img_url: "",
  year: 0,
  product_id: "",
};

interface Props {
  form: UseFormReturn<any, any>;
}

interface FileProps {
  index: number;
  file: File;
}

export function AwardsSectionUpdate({ form }: Props) {
  const t = useTranslations();

  const preUrl =
    SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

  const { control } = form;

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

  const handleAddAward = () => {
    append(emptyAward);
  };

  const handleRemoveAward = (index: number) => {
    setSelectedFiles((current) =>
      current.filter((selectedFile) => selectedFile.index !== index)
    );
    remove(index);
  };

  return (
    <section id="Award">
      {fields.map((field, index) => (
        <div key={field.id}>
          <div className="space-y w-full">
            <InputLabel
              form={form}
              label={`awards.${index}.name`}
              labelText={`${index + 1} ${t("name")}`}
              registerOptions={{
                required: true,
              }}
              placeholder={t("input_product_award_name_placeholder")}
            />

            <div className="ml-4">
              <DeleteButton onClick={() => handleRemoveAward(index)} />
            </div>
          </div>

          <InputLabel
            form={form}
            label={`awards.${index}.description`}
            labelText={"description"}
            registerOptions={{
              required: true,
            }}
            placeholder={t("description")}
          />

          <InputLabel
            form={form}
            label={`awards.${index}.year`}
            labelText={"year"}
            registerOptions={{
              required: true,
              valueAsNumber: true,
            }}
            placeholder={t("input_product_award_year_placeholder")}
            inputType="number"
            defaultValue={2021}
          />

          <div className="space-y w-full">
            <label htmlFor="award_img_url" className="text-sm text-gray-600">
              {t("upload_img_url")}
            </label>

            <FilePreviewImageMultimedia
              form={form}
              registerName={`awards.${index}.img_url`}
              preUrl={preUrl}
            />

            {`errors.awards.${index}.img_url.type` === "required" && (
              <DisplayInputError message="errors.input_required" />
            )}
          </div>

          {/* <Divider className="my-6" /> */}
        </div>
      ))}

      <Button class="" primary medium onClick={() => handleAddAward()}>
        {t("modal_product_award_save")}
      </Button>
    </section>
  );
}

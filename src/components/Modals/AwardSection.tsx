import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button, Divider } from "@supabase/ui";
import { useTranslation } from "react-i18next";
import { Award } from "../../types";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

interface FormProps {
  name: string;
  description: string;
  campaign: string;
  type: number;
  color: number;
  intensity: number;
  aroma: number;
  family: number;
  fermentation: number;
  origin: number;
  era: number;
  format: number;
  isGluten: string;
  awards: Award[];
}

const emptyAward: Award = {
  id: "",
  name: "",
  description: "",
  img_url: "",
  year: 0,
};

export interface Props {
  form: UseFormReturn<FormProps, any>;
}

export const AwardsSection = ({
  form: {
    control,
    register,
    formState: { errors },
  },
}: Props) => {
  const { t } = useTranslation();

  const [isPrevVisible, setIsPrevVisible] = useState(false);

  const { fields, append, remove } = useFieldArray({
    name: "awards",
    control,
  });

  const showPreview = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files!.length > 0) {
      let src = URL.createObjectURL(e.target.files![0]!);

      let preview = document.getElementById(
        `prev-img-${index}`
      ) as HTMLImageElement | null;

      if (preview !== null) {
        setIsPrevVisible(true);
        preview.src = src;
        preview.style.display = "block";
      } else {
        setIsPrevVisible(false);
      }
    }
  };

  return (
    <section id="Award">
      {fields.map((field, index) => (
        <div key={field.id}>
          <div className="w-full space-y">
            <label htmlFor="award_name" className="text-sm text-gray-600">
              <b>{index + 1} </b> {t("name")}
            </label>

            <input
              type="text"
              id="award_name"
              placeholder="Award name"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              {...register(`awards.${index}.name`, {
                required: true,
              })}
            />
            {`errors.awards.${index}.name.type` === "required" && (
              <p>Campo nombre es requerido</p>
            )}
            {`errors.awards.${index}.name.type` === "maxLength" && (
              <p>Nombre debe tener menos de 20 caracteres</p>
            )}
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
              placeholder="Description of the award"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              {...register(`awards.${index}.description`, {
                required: true,
              })}
            />
            {`errors.awards.${index}.description.type` === "required" && (
              <p>Campo nombre es requerido</p>
            )}
            {`errors.awards.${index}.description.type` === "maxLength" && (
              <p>Nombre debe tener menos de 20 caracteres</p>
            )}
          </div>

          <div className="w-full space-y">
            <label htmlFor="award_year" className="text-sm text-gray-600">
              {t("year")}
            </label>

            <input
              type="number"
              id="award_year"
              placeholder="When did the product get the award"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              {...register(`awards.${index}.year`, {
                required: true,
              })}
            />
            {`errors.awards.${index}.year.type` === "required" && (
              <p>Campo año es requerido</p>
            )}
          </div>

          <div className="w-full space-y">
            <label htmlFor="award_img_url" className="text-sm text-gray-600">
              {t("upload_img_url")}
            </label>

            <input
              type="file"
              {...register(`awards.${index}.img_url`, {
                required: true,
              })}
              onChange={(e) => showPreview(e, index)}
              accept="image/png, image/jpeg"
              id="award_img_url"
              placeholder="When did the product get the award"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            {`errors.awards.${index}.img_url.type` === "required" && (
              <p>Campo imagen es requerido</p>
            )}

            <div
              aria-label="Preview Uploaded Image"
              className={`${isPrevVisible ? "block" : "hidden"}
              }`}
            >
              <Image
                id={`prev-img-${index}`}
                width="128"
                height="128"
                alt="Preview uploaded image"
                src={""}
              />
            </div>
          </div>

          <Divider className="my-6" />
        </div>
      ))}

      <div>
        <Button className="" onClick={() => append(emptyAward)}>
          Add award
        </Button>
      </div>
    </section>
  );
};
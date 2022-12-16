import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button, Divider } from "@supabase/ui";
import { useTranslation } from "react-i18next";
import { Award } from "../../types";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import FilePreview from "../FilePreviews";

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
  beer_id: "",
};

export interface Props {
  form: UseFormReturn<FormProps, any>;
}

export const MultimediaSection = ({
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
      console.log(src);

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

  useEffect(() => {}, []);

  return (
    <section id="Multimedia">
      <div className="photo_gallery flex w-full">
        <div className="principal w-full">
          <FilePreview />
        </div>
        <div className="back w-full">
          <FilePreview />
        </div>
        <div className="extra_1 w-full">
          <FilePreview />
        </div>
        <div className="extra_2 w-full">
          <FilePreview />
        </div>
        <div className="extra_3 w-full">
          <FilePreview />
        </div>
      </div>
      <div className="video_gallery">
        <div className="principal"></div>
        <div className="extra_1"></div>
      </div>
    </section>
  );
};

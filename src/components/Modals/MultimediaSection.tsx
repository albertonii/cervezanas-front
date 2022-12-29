import { UseFormReturn } from "react-hook-form";
import { Award, ProductFormat } from "../../types";
import FilePreview from "../FilePreviews";

interface FormProps {
  is_public: boolean;
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
  isGluten: string;
  awards: Award[];
  p_principal: FileList;
  p_back: FileList;
  p_extra_1: FileList;
  p_extra_2: FileList;
  p_extra_3: FileList;
  formats: ProductFormat[];
}

export interface Props {
  form: UseFormReturn<FormProps, any>;
}

export const MultimediaSection = (props: Props) => {
  const { form } = props;

  return (
    <section id="Multimedia">
      <div className="photo_gallery flex w-full">
        <div className="principal w-full">
          <FilePreview form={form} registerName="p_principal" />
        </div>
        <div className="back w-full">
          <FilePreview form={form} registerName="p_back" />
        </div>
        <div className="extra_1 w-full">
          <FilePreview form={form} registerName="p_extra_1" />
        </div>
        <div className="extra_2 w-full">
          <FilePreview form={form} registerName="p_extra_2" />
        </div>
        <div className="extra_3 w-full">
          <FilePreview form={form} registerName="p_extra_3" />
        </div>
      </div>

      <div className="video_gallery">
        <div className="principal"></div>
        <div className="extra_1"></div>
      </div>
    </section>
  );
};

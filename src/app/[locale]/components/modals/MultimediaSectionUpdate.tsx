import { UseFormReturn } from "react-hook-form";
import { FilePreviewImageMultimedia } from "../common/FilePreviewImageMultimedia";
import { ModalUpdateProductFormData } from "../../../../lib/types";

export interface Props {
  form: UseFormReturn<ModalUpdateProductFormData, any>;
}

export function MultimediaSectionUpdate(props: Props) {
  const { form } = props;

  return (
    <section id="Multimedia">
      <div className="photo_gallery flex w-full">
        <figure className="principal w-full">
          <FilePreviewImageMultimedia form={form} registerName="p_principal" />
        </figure>

        <figure className="back w-full">
          <FilePreviewImageMultimedia form={form} registerName="p_back" />
        </figure>

        <figure className="extra_1 w-full">
          <FilePreviewImageMultimedia form={form} registerName="p_extra_1" />
        </figure>

        <figure className="extra_2 w-full">
          <FilePreviewImageMultimedia form={form} registerName="p_extra_2" />
        </figure>

        <figure className="extra_3 w-full">
          <FilePreviewImageMultimedia form={form} registerName="p_extra_3" />
        </figure>
      </div>

      <div className="video_gallery">
        <div className="principal"></div>
        <div className="extra_1"></div>
      </div>
    </section>
  );
}

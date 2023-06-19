import { UseFormReturn } from "react-hook-form";
import { ModalAddProductProps } from "../../lib/types.d";
import { FilePreviewImageMultimedia } from "../common";

export interface Props {
  form: UseFormReturn<ModalAddProductProps, any>;
}

export function MultimediaSection(props: Props) {
  const { form } = props;

  return (
    <section id="Multimedia">
      <div className="photo_gallery flex w-full">
        <div className="principal w-full">
          <FilePreviewImageMultimedia form={form} registerName="p_principal" />
        </div>
        <div className="back w-full">
          <FilePreviewImageMultimedia form={form} registerName="p_back" />
        </div>
        <div className="extra_1 w-full">
          <FilePreviewImageMultimedia form={form} registerName="p_extra_1" />
        </div>
        <div className="extra_2 w-full">
          <FilePreviewImageMultimedia form={form} registerName="p_extra_2" />
        </div>
        <div className="extra_3 w-full">
          <FilePreviewImageMultimedia form={form} registerName="p_extra_3" />
        </div>
      </div>

      <div className="video_gallery">
        <div className="principal"></div>
        <div className="extra_1"></div>
      </div>
    </section>
  );
}

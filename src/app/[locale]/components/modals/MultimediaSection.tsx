import { UseFormReturn } from 'react-hook-form';
import { FilePreviewImageMultimedia } from '../common/FilePreviewImageMultimedia';
import { ModalAddProductFormData } from '../../../../lib/types/types';

export interface Props {
  form: UseFormReturn<ModalAddProductFormData, any>;
}

export function MultimediaSection({ form }: Props) {
  return (
    <section className="photo_gallery flex w-full space-x-4">
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
    </section>
  );
}

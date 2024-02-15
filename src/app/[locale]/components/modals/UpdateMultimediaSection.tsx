import { UseFormReturn } from 'react-hook-form';
import { FilePreviewImageMultimedia } from '../common/FilePreviewImageMultimedia';
import { ModalUpdateProductFormData } from '../../../../lib/types';
import { SupabaseProps } from '../../../../constants';

export interface Props {
  form: UseFormReturn<ModalUpdateProductFormData, any>;
}

export function UpdateMultimediaSection(props: Props) {
  const { form } = props;

  const preUrl =
    SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

  return (
    <section id="photo_gallery flex w-full space-x-4">
      <figure className="principal w-full">
        <FilePreviewImageMultimedia
          form={form}
          registerName="p_principal"
          preUrl={preUrl}
        />
      </figure>

      <figure className="back w-full">
        <FilePreviewImageMultimedia
          form={form}
          registerName="p_back"
          preUrl={preUrl}
        />
      </figure>

      <figure className="extra_1 w-full">
        <FilePreviewImageMultimedia
          form={form}
          registerName="p_extra_1"
          preUrl={preUrl}
        />
      </figure>

      <figure className="extra_2 w-full">
        <FilePreviewImageMultimedia
          form={form}
          registerName="p_extra_2"
          preUrl={preUrl}
        />
      </figure>

      <figure className="extra_3 w-full">
        <FilePreviewImageMultimedia
          form={form}
          registerName="p_extra_3"
          preUrl={preUrl}
        />
      </figure>
    </section>
  );
}

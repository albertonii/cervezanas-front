import { UseFormReturn } from 'react-hook-form';
import { ModalAddBoxPackFormData } from '../../../../../lib/types/product';
import { FilePreviewImageMultimedia } from '../../common/FilePreviewImageMultimedia';

export interface Props {
    form: UseFormReturn<ModalAddBoxPackFormData, any>;
}

export function BoxMultimediaSection({ form }: Props) {
    return (
        <section className=" flex w-full space-x-4" id="photo_gallery">
            <FilePreviewImageMultimedia
                form={form}
                registerName="p_principal"
            />
            <FilePreviewImageMultimedia form={form} registerName="p_back" />
            <FilePreviewImageMultimedia form={form} registerName="p_extra_1" />
            <FilePreviewImageMultimedia form={form} registerName="p_extra_2" />
            <FilePreviewImageMultimedia form={form} registerName="p_extra_3" />
        </section>
    );
}

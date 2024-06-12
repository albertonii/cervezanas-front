import { UseFormReturn } from 'react-hook-form';
import { FilePreviewImageMultimedia } from '../common/FilePreviewImageMultimedia';
import { ModalAddProductFormData } from '../../../../lib/types/types';

export interface Props {
    form: UseFormReturn<ModalAddProductFormData, any>;
}

export function MultimediaSection({ form }: Props) {
    return (
        <section className="flex w-full space-x-4" id="photo_gallery">
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

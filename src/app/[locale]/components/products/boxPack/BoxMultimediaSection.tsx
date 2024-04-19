import { UseFormReturn } from 'react-hook-form';
import { ModalAddBoxPackFormData } from '../../../../../lib/types/product';
import { FilePreviewImageMultimedia } from '../../common/FilePreviewImageMultimedia';

export interface Props {
    form: UseFormReturn<ModalAddBoxPackFormData, any>;
}

export function BoxMultimediaSection({ form }: Props) {
    return (
        <section className="photo_gallery flex w-full space-x-4">
            <figure className="principal w-full">
                <FilePreviewImageMultimedia
                    form={form}
                    registerName="p_principal"
                />
            </figure>
            <figure className="back w-full">
                <FilePreviewImageMultimedia form={form} registerName="p_back" />
            </figure>
            <figure className="extra_1 w-full">
                <FilePreviewImageMultimedia
                    form={form}
                    registerName="p_extra_1"
                />
            </figure>
            <figure className="extra_2 w-full">
                <FilePreviewImageMultimedia
                    form={form}
                    registerName="p_extra_2"
                />
            </figure>
            <figure className="extra_3 w-full">
                <FilePreviewImageMultimedia
                    form={form}
                    registerName="p_extra_3"
                />
            </figure>
        </section>
    );
}

import { UseFormReturn } from 'react-hook-form';
import { SupabaseProps } from '@/constants';
import { ModalUpdateProductFormData } from '@/lib//types/types';
import { UpdateFilePreviewImageMultimedia } from './UpdateFilePreviewImageMultimedia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

export interface Props {
    productId: string;
    form: UseFormReturn<ModalUpdateProductFormData, any>;
}

export function UpdateMultimediaSection({ form, productId }: Props) {
    const preUrl =
        SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

    return (
        <section
            className="relative border-2 rounded-lg border-gray-200 py-6 px-2 sm:px-6 bg-white shadow-md flex w-full space-x-4 py-16"
            id="photo_gallery"
        >
            <FontAwesomeIcon
                icon={faImage}
                title={'Beer Properties Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <UpdateFilePreviewImageMultimedia
                productId={productId}
                form={form}
                registerName="p_principal"
                preUrl={preUrl}
            />

            <UpdateFilePreviewImageMultimedia
                productId={productId}
                form={form}
                registerName="p_back"
                preUrl={preUrl}
            />

            <UpdateFilePreviewImageMultimedia
                productId={productId}
                form={form}
                registerName="p_extra_1"
                preUrl={preUrl}
            />

            <UpdateFilePreviewImageMultimedia
                productId={productId}
                form={form}
                registerName="p_extra_2"
                preUrl={preUrl}
            />

            <UpdateFilePreviewImageMultimedia
                productId={productId}
                form={form}
                registerName="p_extra_3"
                preUrl={preUrl}
            />
        </section>
    );
}

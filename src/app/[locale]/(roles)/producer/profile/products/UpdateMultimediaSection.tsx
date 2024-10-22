import { UseFormReturn } from 'react-hook-form';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { ModalUpdateProductFormData } from '@/lib//types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProductMediaUploader from '@/app/[locale]/components/products/ProductMediaUploader';

export interface Props {
    productId: string;
    form: UseFormReturn<ModalUpdateProductFormData, any>;
}

export function UpdateMultimediaSection({ form, productId }: Props) {
    return (
        <section
            className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md flex w-full space-x-4 py-16"
            id="photo_gallery"
        >
            <FontAwesomeIcon
                icon={faImage}
                title={'Beer Properties Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <ProductMediaUploader />
            {/* 

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
            /> */}
        </section>
    );
}

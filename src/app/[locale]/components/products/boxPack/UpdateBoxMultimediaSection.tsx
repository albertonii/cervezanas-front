import { UseFormReturn } from 'react-hook-form';
import { SupabaseProps } from '@/constants';
import { ModalUpdateBoxPackFormData } from '@/lib//types/product';
import { UpdateFilePreviewImageMultimedia } from '../../../(roles)/producer/profile/products/UpdateFilePreviewImageMultimedia';

export interface Props {
    productId: string;
    form: UseFormReturn<ModalUpdateBoxPackFormData, any>;
}

export function UpdateBoxMultimediaSection({ form, productId }: Props) {
    const preUrl =
        SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

    return (
        <section className=" flex w-full space-x-4" id="photo_gallery">
            <UpdateFilePreviewImageMultimedia
                productId={productId}
                form={form}
                registerName="p_principal"
                preUrl={preUrl}
                isBoxPack={true}
            />

            <UpdateFilePreviewImageMultimedia
                productId={productId}
                form={form}
                registerName="p_back"
                preUrl={preUrl}
                isBoxPack={true}
            />

            <UpdateFilePreviewImageMultimedia
                productId={productId}
                form={form}
                registerName="p_extra_1"
                preUrl={preUrl}
                isBoxPack={true}
            />

            <UpdateFilePreviewImageMultimedia
                productId={productId}
                form={form}
                registerName="p_extra_2"
                preUrl={preUrl}
                isBoxPack={true}
            />

            <UpdateFilePreviewImageMultimedia
                productId={productId}
                form={form}
                registerName="p_extra_3"
                preUrl={preUrl}
                isBoxPack={true}
            />
        </section>
    );
}

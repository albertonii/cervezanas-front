import { UseFormReturn } from 'react-hook-form';
import { SupabaseProps } from '../../../../../../constants';
import { ModalUpdateProductFormData } from '../../../../../../lib/types/types';
import { UpdateFilePreviewImageMultimedia } from './UpdateFilePreviewImageMultimedia';

export interface Props {
    productId: string;
    form: UseFormReturn<ModalUpdateProductFormData, any>;
}

export function UpdateMultimediaSection(props: Props) {
    const { form, productId } = props;

    const preUrl =
        SupabaseProps.BASE_URL + SupabaseProps.STORAGE_PRODUCTS_IMG_URL;

    return (
        <section className="flex w-full space-x-4" id="photo_gallery">
            <figure className="principal w-full">
                <UpdateFilePreviewImageMultimedia
                    productId={productId}
                    form={form}
                    registerName="p_principal"
                    preUrl={preUrl}
                />
            </figure>

            <figure className="back w-full">
                <UpdateFilePreviewImageMultimedia
                    productId={productId}
                    form={form}
                    registerName="p_back"
                    preUrl={preUrl}
                />
            </figure>

            <figure className="extra_1 w-full">
                <UpdateFilePreviewImageMultimedia
                    productId={productId}
                    form={form}
                    registerName="p_extra_1"
                    preUrl={preUrl}
                />
            </figure>

            <figure className="extra_2 w-full">
                <UpdateFilePreviewImageMultimedia
                    productId={productId}
                    form={form}
                    registerName="p_extra_2"
                    preUrl={preUrl}
                />
            </figure>

            <figure className="extra_3 w-full">
                <UpdateFilePreviewImageMultimedia
                    productId={productId}
                    form={form}
                    registerName="p_extra_3"
                    preUrl={preUrl}
                />
            </figure>
        </section>
    );
}

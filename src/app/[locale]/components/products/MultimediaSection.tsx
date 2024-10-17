import ProductMediaUploader from './ProductMediaUploader';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function MultimediaSection() {
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
            <FilePreviewImageMultimedia
                form={form}
                registerName="p_principal"
            />
            <FilePreviewImageMultimedia form={form} registerName="p_back" />
            <FilePreviewImageMultimedia form={form} registerName="p_extra_1" />
            <FilePreviewImageMultimedia form={form} registerName="p_extra_2" />
            <FilePreviewImageMultimedia form={form} registerName="p_extra_3" /> */}
        </section>
    );
}

import ProductMediaUploader from '@/app/[locale]/components/products/ProductMediaUploader';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function UpdateMultimediaSection() {
    return (
        <section
            className="relative border-2 rounded-lg border-gray-200  px-2 sm:px-6 bg-white shadow-md flex flex-col sm:flex-row w-full space-x-0 sm:space-x-4 py-6 m-0"
            id="photo_gallery"
        >
            <FontAwesomeIcon
                icon={faImage}
                title={'Beer Properties Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <ProductMediaUploader />
        </section>
    );
}

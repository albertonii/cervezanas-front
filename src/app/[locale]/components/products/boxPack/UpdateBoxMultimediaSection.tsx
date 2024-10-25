import ProductMediaUploader from '../ProductMediaUploader';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function UpdateBoxMultimediaSection() {
    return (
        <section className=" flex w-full space-x-4" id="photo_gallery">
            <FontAwesomeIcon
                icon={faImage}
                title={'Beer Properties Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <ProductMediaUploader />
        </section>
    );
}

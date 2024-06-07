import Button from './Button';
import React, { memo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    faChevronCircleLeft,
    faChevronCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
interface Props {
    counter: number;
    resultsPerPage: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const PaginationFooter = memo(function PaginationFooter({
    counter,
    currentPage,
    resultsPerPage,
    setCurrentPage,
}: Props) {
    const t = useTranslations();

    const [isLoading, setIsLoading] = useState(false);

    const lastElementPage =
        counter < currentPage * resultsPerPage
            ? counter
            : currentPage * resultsPerPage;

    const finalPage = Math.ceil(counter / resultsPerPage);

    const handlePrevPage = () => {
        if (!isLoading && currentPage > 1) {
            setIsLoading(true);
            setTimeout(() => {
                setCurrentPage(currentPage - 1);
                setIsLoading(false);
            }, 200);
        }
    };

    const handleNextPage = () => {
        if (!isLoading && currentPage < Math.ceil(counter / resultsPerPage)) {
            setIsLoading(true);
            setTimeout(() => {
                setCurrentPage(currentPage + 1);
                setIsLoading(false);
            }, 200);
        }
    };

    return (
        <footer className="flex items-center justify-between py-4 px-6 bg-white shadow-md rounded-lg space-x-4">
            <Button
                onClick={handlePrevPage}
                small
                primary
                disabled={isLoading || currentPage === 1}
                class="flex items-center justify-center"
            >
                <FontAwesomeIcon
                    icon={faChevronCircleLeft}
                    className="text-gray-600"
                    title={'Previous Page'}
                    width={20}
                    height={20}
                />
            </Button>

            <p className="text-lg text-gray-600">
                {t('pagination_footer_nums', {
                    from: (currentPage - 1) * resultsPerPage + 1,
                    to: lastElementPage,
                    total: counter,
                })}
            </p>

            <Button
                onClick={handleNextPage}
                small
                primary
                disabled={isLoading || currentPage === finalPage}
                class="flex items-center justify-center"
            >
                <FontAwesomeIcon
                    icon={faChevronCircleRight}
                    className="text-gray-600"
                    title={'Next Page'}
                    width={20}
                    height={20}
                />
            </Button>
        </footer>
    );
});

export default PaginationFooter;

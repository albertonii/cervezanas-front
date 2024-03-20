import Image from 'next/image';
import PaginationFooter from '../../../../components/common/PaginationFooter';
import useFetchLotsByOwnerAndPagination from '../../../../../../hooks/useFetchLotsByOwner';
import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IProductLot } from '../../../../../../lib/types/types';
import { DeleteButton } from '../../../../components/common/DeleteButton';
import { EditButton } from '../../../../components/common/EditButton';
import Spinner from '../../../../components/common/Spinner';
import { formatDateString } from '../../../../../../utils/formatDate';
import InputSearch from '../../../../components/common/InputSearch';

interface Props {
    handleEditShowModal: React.Dispatch<React.SetStateAction<any>>;
    handleDeleteShowModal: React.Dispatch<React.SetStateAction<any>>;
    handleProductLotModal: React.Dispatch<React.SetStateAction<any>>;
}

interface ColumnsProps {
    header: string;
}

export function LotList({
    handleEditShowModal,
    handleDeleteShowModal,
    handleProductLotModal,
}: Props) {
    const { user } = useAuth();
    if (!user) return null;
    const t = useTranslations();

    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 100;

    const {
        data: lots,
        isError,
        isLoading,
    } = useFetchLotsByOwnerAndPagination(user.id, currentPage, resultsPerPage);

    const counter = lots?.length ?? 0;

    const COLUMNS = [
        { header: t('product_type_header') },
        { header: t('lot_number_header') },
        { header: t('quantity_header') },
        { header: t('manufacture_date_header') },
        { header: t('expiration_date_header') },
        { header: t('action_header') },
    ];

    const handleClickEdit = (lot: IProductLot) => {
        handleEditShowModal(true);
        handleDeleteShowModal(false);
        handleProductLotModal(lot);
    };

    const handleClickDelete = (lot: IProductLot) => {
        handleEditShowModal(false);
        handleDeleteShowModal(true);
        handleProductLotModal(lot);
    };

    const filteredItems = useMemo<any[]>(() => {
        if (!lots) return [];
        return lots?.filter((lot) => {
            return lot.lot_name.toLowerCase().includes(query.toLowerCase());
        });
    }, [lots, query]);

    return (
        <section className="bg-beer-foam relative mt-6 space-y-4 overflow-x-auto shadow-md sm:rounded-lg">
            {isError && (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('error_fetching_lots')}
                    </p>
                </div>
            )}

            {isLoading && (
                <Spinner color="beer-blonde" size="xLarge" absolute center />
            )}

            {!isLoading && !isError && lots?.length === 0 ? (
                <div className="my-[10vh] flex items-center justify-center">
                    <p className="text-2xl text-gray-500 dark:text-gray-400">
                        {t('no_lots')}
                    </p>
                </div>
            ) : (
                <>
                    <InputSearch
                        query={query}
                        setQuery={setQuery}
                        searchPlaceholder={'search_lots'}
                    />

                    <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {COLUMNS.map(
                                    (column: ColumnsProps, index: number) => {
                                        return (
                                            <th
                                                key={index}
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                {column.header}
                                            </th>
                                        );
                                    },
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {lots &&
                                filteredItems.map((lot) => {
                                    return (
                                        <tr key={lot.id} className="">
                                            <th
                                                scope="row"
                                                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                            >
                                                <Image
                                                    width={128}
                                                    height={128}
                                                    className="h-8 w-8 rounded-full"
                                                    alt="Beer Type"
                                                    src="/icons/beer-240.png"
                                                    loader={() =>
                                                        '/icons/beer-240.png'
                                                    }
                                                />
                                            </th>

                                            <td className="px-6 py-4">
                                                {lot.lot_name}
                                            </td>

                                            <td className="px-6 py-4">
                                                {lot.quantity}
                                            </td>

                                            <td className="px-6 py-4">
                                                {formatDateString(
                                                    lot.manufacture_date,
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                {formatDateString(
                                                    lot.expiration_date,
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex space-x-1">
                                                    <EditButton
                                                        onClick={() =>
                                                            handleClickEdit(lot)
                                                        }
                                                    />

                                                    <DeleteButton
                                                        onClick={() =>
                                                            handleClickDelete(
                                                                lot,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    {/* Prev and Next button for pagination  */}
                    <div className="my-4 flex items-center justify-around">
                        <PaginationFooter
                            counter={counter}
                            resultsPerPage={resultsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </>
            )}
        </section>
    );
}

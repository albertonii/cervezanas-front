import Image from 'next/image';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import useFetchLotsByOwnerAndPagination from '../../../../../../hooks/useFetchLotsByOwner';
import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IProductLot } from '@/lib//types/types';
import { formatDateString } from '@/utils/formatDate';
import { DeleteButton } from '@/app/[locale]/components/ui/buttons/DeleteButton';
import { EditButton } from '@/app/[locale]/components/ui/buttons/EditButton';
import PaginationFooter from '@/app/[locale]/components/ui/PaginationFooter';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import THead from '@/app/[locale]/components/ui/table/THead';
import TR from '@/app/[locale]/components/ui/table/TR';
import Table from '@/app/[locale]/components/ui/table/Table';
import TH from '@/app/[locale]/components/ui/table/TH';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import TD from '@/app/[locale]/components/ui/table/TD';

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
    const resultsPerPage = 10;

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
                        {t('errors.fetching_lots')}
                    </p>
                </div>
            )}

            {isLoading && (
                <Spinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    flexCenter
                />
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

                    <Table>
                        <THead>
                            <TR>
                                {COLUMNS.map(
                                    (column: ColumnsProps, index: number) => {
                                        return (
                                            <TH key={index} scope="col">
                                                {column.header}
                                            </TH>
                                        );
                                    },
                                )}
                            </TR>
                        </THead>

                        <TBody>
                            {lots &&
                                filteredItems.map((lot) => {
                                    return (
                                        <TR key={lot.id}>
                                            <TH
                                                scope="row"
                                                class_="whitespace-nowrap "
                                            >
                                                <Image
                                                    width={128}
                                                    height={128}
                                                    className="h-8 w-8 rounded-full"
                                                    alt="Beer Type"
                                                    src="/icons/beer-240.png"
                                                />
                                            </TH>

                                            <TD>{lot.lot_name}</TD>

                                            <TD>{lot.quantity}</TD>

                                            <TD>
                                                {formatDateString(
                                                    lot.manufacture_date,
                                                )}
                                            </TD>

                                            <TD>
                                                {formatDateString(
                                                    lot.expiration_date,
                                                )}
                                            </TD>

                                            <TD>
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
                                            </TD>
                                        </TR>
                                    );
                                })}
                        </TBody>
                    </Table>

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

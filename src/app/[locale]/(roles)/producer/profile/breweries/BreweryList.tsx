'use client';

import useBreweryStore from '@/app/store/breweryStore';
import Spinner from '@/app/[locale]/components/common/Spinner';
import TableWithFooterAndSearch from '@/app/[locale]/components/TableWithFooterAndSearch';
import useFetchBreweriesByOwnerAndPagination from '@/hooks/useFetchBreweriesByOwnerAndPagination';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IBrewery } from '@/lib/types/types';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { DeleteButton } from '@/app/[locale]/components/common/DeleteButton';
import { EditButton } from '@/app/[locale]/components/common/EditButton';

interface Props {
    counter: number;
}

const BreweryList = ({ counter }: Props) => {
    const { user } = useAuth();
    if (!user) return null;

    const t = useTranslations();
    const { assignBrewery, handleEditShowModal, handleDeleteShowModal } =
        useBreweryStore();

    const [breweries, setBreweries] = useState<IBrewery[] | null>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 10;

    const { data, isError, isLoading, refetch, isFetchedAfterMount } =
        useFetchBreweriesByOwnerAndPagination(
            currentPage,
            resultsPerPage,
            false,
        );

    useEffect(() => {
        if (isFetchedAfterMount) {
            setBreweries(data as IBrewery[]);
        }
    }, [isFetchedAfterMount, data]);

    useEffect(() => {
        refetch().then((res: any) => {
            const data = res.data as IBrewery[];
            const breweries = data;
            setBreweries(breweries);
        });

        return () => {};
    }, [currentPage]);

    const columns = [
        {
            header: t('brewery.name'),
            accessor: 'name',
            sortable: true,
            render: (value: string, row: IBrewery) => {
                return <div>{row.name}</div>;
            },
        },
        {
            header: t('region'),
            accessor: 'region',
            sortable: true,
            render: (value: string, row: IBrewery) => {
                return <div>{row.region}</div>;
            },
        },
        {
            header: t('sub_region'),
            accessor: 'sub_region',
            sortable: true,
            render: (value: string, row: IBrewery) => {
                return <div>{row.sub_region}</div>;
            },
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (_: any, row: IBrewery) => (
                <div className="flex justify-center space-x-2">
                    <EditButton
                        onClick={() => {
                            assignBrewery(row);
                            handleEditShowModal(true);
                            handleDeleteShowModal(false);
                        }}
                    />

                    <DeleteButton
                        onClick={() => {
                            assignBrewery(row);
                            handleDeleteShowModal(true);
                            handleEditShowModal(false);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <section className="bg-beer-foam relative mt-2 rounded-md border-2 border-beer-blonde px-2 py-4 shadow-xl">
            {isError && (
                <div className="flex items-center justify-center py-6">
                    <p className="text-gray-500">
                        {t('errors.fetching_breweries')}
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

            {!isError && !isLoading && breweries?.length === 0 ? (
                <div className="my-[10vh] flex items-center justify-center">
                    <p className="text-2xl text-gray-500">{t('no_products')}</p>
                </div>
            ) : (
                <TableWithFooterAndSearch
                    columns={columns}
                    data={breweries ?? []}
                    initialQuery={''}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchPlaceHolder={'search_by_name'}
                    paginationCounter={counter}
                    sourceDataIsFromServer={false}
                />
            )}
        </section>
    );
};

export default BreweryList;

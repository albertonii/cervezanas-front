'use client';

import useBreweryStore from '@/app/store/breweryStore';
import useFetchBreweriesByOwnerAndPagination from '@/hooks/useFetchBreweriesByOwnerAndPagination';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IBrewery } from '@/lib/types/types';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { DeleteButton } from '@/app/[locale]/components/ui/buttons/DeleteButton';
import { EditButton } from '@/app/[locale]/components/ui/buttons/EditButton';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import ListTableWrapper from '@/app/[locale]/components/ui/ListTableWrapper';

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
        <ListTableWrapper
            isError={isError}
            isLoading={isLoading}
            errorMessage={'errors.fetching_breweries'}
        >
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
        </ListTableWrapper>
    );
};

export default BreweryList;

import React, { useState, useMemo, useEffect } from 'react';
import InputSearch from './common/InputSearch';
import PaginationFooter from './common/PaginationFooter';

interface Column {
    header: string;
    accessor: string;
    sortable?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
}

enum SortOrder {
    NONE = 'none',
    ASC = 'asc',
    DESC = 'desc',
}

interface TableProps {
    columns: Column[];
    data: any[];
    initialQuery?: string;
    resultsPerPage?: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    searchPlaceHolder: string;
    paginationCounter: number;
}

const TableWithFoorterAndSearch: React.FC<TableProps> = ({
    columns,
    data,
    initialQuery = '',
    resultsPerPage = 10,
    currentPage,
    setCurrentPage,
    searchPlaceHolder,
    paginationCounter = 0,
}) => {
    const [query, setQuery] = useState(initialQuery);
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.NONE);
    const [sortColumn, setSortColumn] = useState<string | null>(null);

    const filteredItems = useMemo(() => {
        if (!query) return data;
        return data.filter((row) =>
            columns.some((column) =>
                String(row[column.accessor])
                    .toLowerCase()
                    .includes(query.toLowerCase()),
            ),
        );
    }, [query, data, columns]);

    const sortedItems = useMemo(() => {
        if (sortOrder === SortOrder.NONE || !sortColumn) return filteredItems;

        const sortedData = [...filteredItems].sort((a, b) => {
            const aValue = String(a[sortColumn]);
            const bValue = String(b[sortColumn]);

            if (sortOrder === SortOrder.ASC) {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

        return sortedData;
    }, [filteredItems, sortOrder, sortColumn]);

    const totalPages = Math.ceil(filteredItems.length / resultsPerPage);

    const handleSort = (accessor: string) => {
        if (sortColumn === accessor) {
            if (sortOrder === SortOrder.ASC) {
                setSortOrder(SortOrder.DESC);
            } else {
                setSortOrder(SortOrder.NONE);
                setSortColumn(null);
            }
        } else {
            setSortColumn(accessor);
            setSortOrder(SortOrder.ASC);
        }
    };

    return (
        <div className="space-y-4">
            <InputSearch
                query={query}
                setQuery={setQuery}
                searchPlaceholder={searchPlaceHolder}
            />

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.accessor}
                                    className={`
                                            px-6 py-3 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-medium
                                            ${
                                                column.sortable &&
                                                'hover:bg-gray-100 cursor-pointer'
                                            }
                                        `}
                                    onClick={() =>
                                        column.sortable &&
                                        handleSort(column.accessor)
                                    }
                                >
                                    {column.header}
                                    {column.sortable &&
                                        sortColumn === column.accessor && (
                                            <span>
                                                {sortOrder === SortOrder.ASC
                                                    ? ' ▲'
                                                    : ' ▼'}
                                            </span>
                                        )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedItems.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b">
                                {columns.map((column) => (
                                    <td
                                        key={column.accessor}
                                        className="px-6 py-4 text-gray-800 text-sm"
                                    >
                                        {column.render
                                            ? column.render(
                                                  row[column.accessor],
                                                  row,
                                              )
                                            : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PaginationFooter
                counter={paginationCounter}
                resultsPerPage={resultsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default TableWithFoorterAndSearch;

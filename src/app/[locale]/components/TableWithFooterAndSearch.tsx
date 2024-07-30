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
    expandedRowRender?: (row: any) => React.ReactNode; // New prop for expanded row render
    sourceDataIsFromServer: boolean;
}

const TableWithFooterAndSearch: React.FC<TableProps> = ({
    columns,
    data,
    initialQuery = '',
    resultsPerPage = 10,
    currentPage,
    setCurrentPage,
    searchPlaceHolder,
    paginationCounter = 0,
    expandedRowRender,
    sourceDataIsFromServer = false,
}) => {
    const [query, setQuery] = useState(initialQuery);
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.NONE);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const filteredItems = useMemo(() => {
        if (!query) return data;
        return data.filter((row) =>
            columns.some((column) => {
                return String(row[column.accessor])
                    .toLowerCase()
                    .includes(query.toLowerCase());
            }),
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

    const paginatedItems = useMemo(() => {
        if (!sourceDataIsFromServer) {
            return sortedItems;
        }

        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        return sortedItems.slice(startIndex, endIndex);
    }, [sortedItems, currentPage, resultsPerPage]);

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

    const toggleRowExpansion = (rowId: string) => {
        setExpandedRow(expandedRow === rowId ? null : rowId);
    };

    return (
        <div className="space-y-6">
            <InputSearch
                query={query}
                setQuery={setQuery}
                searchPlaceholder={searchPlaceHolder}
            />

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.accessor}
                                    className={`
                                        px-6 py-3 border-b border-gray-200 text-gray-800 text-left text-sm font-medium tracking-wider
                                        ${
                                            column.sortable
                                                ? 'cursor-pointer select-none'
                                                : ''
                                        }
                                    `}
                                    onClick={() =>
                                        column.sortable &&
                                        handleSort(column.accessor)
                                    }
                                >
                                    <div className="flex items-center">
                                        {column.header}
                                        {column.sortable &&
                                            sortColumn === column.accessor && (
                                                <span className="ml-1 text-xs">
                                                    {sortOrder === SortOrder.ASC
                                                        ? '▲'
                                                        : '▼'}
                                                </span>
                                            )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedItems.map((row, rowIndex) => {
                            return (
                                <>
                                    <tr
                                        key={rowIndex}
                                        className={`hover:bg-gray-100 ${
                                            expandedRowRender &&
                                            'cursor-pointer'
                                        }`}
                                        onClick={() => {
                                            if (expandedRowRender) {
                                                toggleRowExpansion(row.id);
                                            }
                                        }}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={column.accessor}
                                                className="px-6 py-4 whitespace-nowrap text-gray-700"
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

                                    {expandedRow === row.id &&
                                        expandedRowRender && (
                                            <tr className="bg-gray-50">
                                                <td
                                                    colSpan={columns.length}
                                                    className="px-6 py-4"
                                                >
                                                    {expandedRowRender(row)}
                                                </td>
                                            </tr>
                                        )}
                                </>
                            );
                        })}
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

export default TableWithFooterAndSearch;
